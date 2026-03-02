import React, { useState, useEffect } from 'react';
import { usePermit } from '../../context/PermitContext';
import { WORK_AREAS, PERMIT_STATUS } from '../../utils/constants';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerStyles = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #f8f9fa'
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const statsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const statCardStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  border: '1px solid #e9ecef'
};

const statValueStyles = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '8px'
};

const statLabelStyles = {
  fontSize: '14px',
  color: '#7f8c8d',
  fontWeight: '600'
};

const chartGridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '25px',
  marginBottom: '30px'
};

const chartContainerStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const chartTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px'
};

const barChartStyles = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '10px',
  height: '200px',
  padding: '15px 0'
};

const barStyles = (height, color) => ({
  flex: 1,
  height: `${height}%`,
  backgroundColor: color,
  borderRadius: '4px 4px 0 0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '5px 0'
});

const barLabelStyles = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '12px',
  marginBottom: '5px'
};

const barValueStyles = {
  color: 'white',
  fontSize: '11px'
};

const xAxisStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderTop: '1px solid #ecf0f1'
};

const xAxisLabelStyles = {
  flex: 1,
  textAlign: 'center',
  fontSize: '11px',
  color: '#7f8c8d'
};

const reportSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const reportGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
};

const timeFilterStyles = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  alignItems: 'center'
};

const filterButtonStyles = {
  padding: '8px 16px',
  border: '1px solid #dcdfe6',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '14px'
};

const activeFilterStyles = {
  ...filterButtonStyles,
  backgroundColor: '#3498db',
  color: 'white',
  borderColor: '#3498db'
};

const exportButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const ArchivingAnalytics = ({ permit }) => {
  const { permits, auditTrail } = usePermit();
  const [timeFilter, setTimeFilter] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    calculateAnalytics();
  }, [permits, timeFilter]);

  const calculateAnalytics = () => {
    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      default:
        startDate = new Date(0); // All time
    }

    const filteredPermits = permits.filter(p => new Date(p.createdAt) >= startDate);

    // Basic stats
    const totalPermits = filteredPermits.length;
    const approvedPermits = filteredPermits.filter(p => p.status === PERMIT_STATUS.APPROVED).length;
    const completedPermits = filteredPermits.filter(p => p.status === PERMIT_STATUS.COMPLETED).length;
    const rejectedPermits = filteredPermits.filter(p => p.status === PERMIT_STATUS.REJECTED).length;

    // Work area distribution
    const workAreaStats = WORK_AREAS.map(area => {
      const count = filteredPermits.filter(p => p.workArea === area.code).length;
      const percentage = totalPermits > 0 ? (count / totalPermits) * 100 : 0;
      return { ...area, count, percentage };
    });

    // Status distribution
    const statusStats = Object.values(PERMIT_STATUS).map(status => {
      const count = filteredPermits.filter(p => p.status === status).length;
      const percentage = totalPermits > 0 ? (count / totalPermits) * 100 : 0;
      return { status, count, percentage };
    });

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthKey = month.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthPermits = filteredPermits.filter(p => {
        const permitDate = new Date(p.createdAt);
        return permitDate >= monthStart && permitDate <= monthEnd;
      });

      monthlyTrend.push({
        month: monthKey,
        count: monthPermits.length
      });
    }

    setAnalyticsData({
      totalPermits,
      approvedPermits,
      completedPermits,
      rejectedPermits,
      workAreaStats,
      statusStats,
      monthlyTrend,
      filteredPermits
    });
  };

  const exportReport = () => {
    // Simulate report generation
    const reportData = {
      generatedAt: new Date().toISOString(),
      timePeriod: timeFilter,
      ...analyticsData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      [PERMIT_STATUS.PENDING]: '#f39c12',
      [PERMIT_STATUS.APPROVED]: '#27ae60',
      [PERMIT_STATUS.IN_PROGRESS]: '#3498db',
      [PERMIT_STATUS.COMPLETED]: '#2ecc71',
      [PERMIT_STATUS.REJECTED]: '#e74c3c',
      [PERMIT_STATUS.CLOSED]: '#95a5a6'
    };
    return colors[status] || '#bdc3c7';
  };

  const workAreaColors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={titleStyles}>📊 Safety Analytics & Archiving</h2>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
              Comprehensive safety performance reports and audit analytics
            </p>
          </div>
          <button style={exportButtonStyles} onClick={exportReport}>
            📥 Export Audit Report
          </button>
        </div>

        {/* Time Filter */}
        <div style={timeFilterStyles}>
          <span style={{ fontWeight: '600', color: '#2c3e50' }}>Time Period:</span>
          {['week', 'month', 'quarter', 'all'].map(filter => (
            <button
              key={filter}
              style={timeFilter === filter ? activeFilterStyles : filterButtonStyles}
              onClick={() => setTimeFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.totalPermits || 0}</div>
          <div style={statLabelStyles}>Total Permits</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.approvedPermits || 0}</div>
          <div style={statLabelStyles}>Approved</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.completedPermits || 0}</div>
          <div style={statLabelStyles}>Completed</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.rejectedPermits || 0}</div>
          <div style={statLabelStyles}>Rejected</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>
            {analyticsData.totalPermits ? 
              Math.round((analyticsData.completedPermits / analyticsData.totalPermits) * 100) : 0}%
          </div>
          <div style={statLabelStyles}>Completion Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div style={chartGridStyles}>
        {/* Work Area Distribution */}
        <div style={chartContainerStyles}>
          <h3 style={chartTitleStyles}>Permits by Work Area</h3>
          <div style={barChartStyles}>
            {analyticsData.workAreaStats?.map((area, index) => (
              <div 
                key={area.code}
                style={barStyles(
                  Math.max((area.count / Math.max(...analyticsData.workAreaStats?.map(a => a.count) || [1])) * 80, 10),
                  workAreaColors[index % workAreaColors.length]
                )}
                title={`${area.name}: ${area.count} permits`}
              >
                <div style={barValueStyles}>{area.count}</div>
                <div style={barLabelStyles}>{area.code}</div>
              </div>
            ))}
          </div>
          <div style={xAxisStyles}>
            {analyticsData.workAreaStats?.map(area => (
              <div key={area.code} style={xAxisLabelStyles}>
                {area.code}
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div style={chartContainerStyles}>
          <h3 style={chartTitleStyles}>Status Distribution</h3>
          <div style={barChartStyles}>
            {analyticsData.statusStats?.map((stat, index) => (
              <div 
                key={stat.status}
                style={barStyles(
                  Math.max((stat.count / Math.max(...analyticsData.statusStats?.map(s => s.count) || [1])) * 80, 10),
                  getStatusColor(stat.status)
                )}
                title={`${stat.status}: ${stat.count} permits`}
              >
                <div style={barValueStyles}>{stat.count}</div>
                <div style={barLabelStyles}>
                  {stat.status.split('_').map(word => word.charAt(0)).join('')}
                </div>
              </div>
            ))}
          </div>
          <div style={xAxisStyles}>
            {analyticsData.statusStats?.map(stat => (
              <div key={stat.status} style={xAxisLabelStyles}>
                {stat.status.split('_').map(word => word.charAt(0)).join('')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Reports */}
      <div style={reportSectionStyles}>
        <h3 style={chartTitleStyles}>📋 Safety Audit Reports</h3>
        
        <div style={reportGridStyles}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Compliance Metrics</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>✅ Safety Checklist Completion: 100%</div>
              <div>✅ Photo Evidence Provided: 98%</div>
              <div>✅ Inspection Compliance: 95%</div>
              <div>✅ Closure Verification: 92%</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Performance Indicators</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>⏱️ Average Approval Time: 2.3 hours</div>
              <div>📈 Permit Volume Trend: +15% this month</div>
              <div>🛡️ Safety Incidents: 0 this quarter</div>
              <div>👥 Team Compliance: 99.8%</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Archiving Status</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>🗄️ Total Archived Permits: {permits.filter(p => p.status === PERMIT_STATUS.CLOSED).length}</div>
              <div>💾 DMS Storage: 98% utilized</div>
              <div>🔍 Audit Ready: Yes</div>
              <div>📅 Retention Period: 7 years</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recent Audit Activity</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {auditTrail.slice(0, 10).map((audit, index) => (
              <div key={index} style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                borderLeft: '4px solid #3498db',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                  {audit.action.replace('_', ' ')}
                </div>
                <div style={{ color: '#7f8c8d' }}>
                  {audit.details} • By {audit.user} • {new Date(audit.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivingAnalytics;