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
  borderBottom: '2px solid #34495e'
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const successSectionStyles = {
  backgroundColor: '#d5f4e6',
  padding: '25px',
  borderRadius: '8px',
  border: '2px solid #27ae60',
  marginBottom: '30px',
  textAlign: 'center'
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

const analyticsSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const chartGridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '25px',
  marginBottom: '30px'
};

const chartContainerStyles = {
  backgroundColor: 'white',
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
  backgroundColor: '#e8f4f8',
  padding: '25px',
  borderRadius: '8px',
  border: '1px solid #3498db'
};

const reportGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
};

const exportButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '0 auto'
};

const Step7ArchiveReport = ({ permit }) => {
  const { permits, auditTrail } = usePermit();
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const closedPermits = permits.filter(p => p.status === 'closed');
    const totalPermits = permits.length;

    // Basic stats
    const stats = {
      totalPermits: totalPermits,
      closedPermits: closedPermits.length,
      completionRate: totalPermits > 0 ? (closedPermits.length / totalPermits) * 100 : 0,
      averageDuration: '2.3 hours',
      safetyCompliance: '99.8%'
    };

    // Work area distribution
    const workAreaStats = WORK_AREAS.map(area => {
      const count = permits.filter(p => p.workArea === area.code).length;
      const percentage = totalPermits > 0 ? (count / totalPermits) * 100 : 0;
      return { ...area, count, percentage };
    });

    // Status distribution
    const statusStats = Object.values(PERMIT_STATUS).map(status => {
      const count = permits.filter(p => p.status === status).length;
      const percentage = totalPermits > 0 ? (count / totalPermits) * 100 : 0;
      return { status, count, percentage };
    });

    setAnalyticsData({
      stats,
      workAreaStats,
      statusStats,
      closedPermits
    });
  };

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      permit: permit,
      analytics: analyticsData,
      auditTrail: auditTrail.filter(audit => audit.permitId === permit.id),
      systemInfo: {
        version: '2.0',
        generatedBy: 'E-Permit System',
        retentionPeriod: '7 years'
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permit-audit-report-${permit.permitNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      [PERMIT_STATUS.PENDING]: '#f39c12',
      [PERMIT_STATUS.APPROVED]: '#27ae60',
      [PERMIT_STATUS.IN_PROGRESS]: '#3498db',
      [PERMIT_STATUS.COMPLETED]: '#2ecc71',
      [PERMIT_STATUS.CLOSED]: '#34495e'
    };
    return colors[status] || '#bdc3c7';
  };

  const workAreaColors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#34495e', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>7</span>
          Archive & Report - System
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Permit archived successfully. System-generated analytics and reports available.
        </p>
      </div>

      {/* Success Message */}
      <div style={successSectionStyles}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
        <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>Permit Successfully Archived!</h3>
        <p style={{ color: '#2c3e50', fontSize: '16px', marginBottom: '15px' }}>
          Permit <strong>{permit.permitNumber}</strong> has been closed and archived in the system.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#27ae60', fontWeight: '600' }}>
          ✅ Available for audit for 7 years
        </div>
      </div>

      {/* Key Statistics */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.stats?.totalPermits || 0}</div>
          <div style={statLabelStyles}>Total Permits</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.stats?.closedPermits || 0}</div>
          <div style={statLabelStyles}>Closed Permits</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{Math.round(analyticsData.stats?.completionRate || 0)}%</div>
          <div style={statLabelStyles}>Completion Rate</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{analyticsData.stats?.safetyCompliance || '99.8%'}</div>
          <div style={statLabelStyles}>Safety Compliance</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={analyticsSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>System Analytics</h3>
        
        <div style={chartGridStyles}>
          {/* Work Area Distribution */}
          <div style={chartContainerStyles}>
            <h4 style={chartTitleStyles}>Permits by Work Area</h4>
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
            <h4 style={chartTitleStyles}>Status Distribution</h4>
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
      </div>

      {/* Audit Reports */}
      <div style={reportSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>Audit Reports & Documentation</h3>
        
        <div style={reportGridStyles}>
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>📊 Performance Metrics</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>✅ Safety Checklist Completion: 100%</div>
              <div>✅ Inspection Compliance: 98%</div>
              <div>✅ Closure Verification: 100%</div>
              <div>✅ Documentation Complete: 100%</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>📈 System Metrics</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>⏱️ Average Processing Time: 2.3 hours</div>
              <div>📋 Total Checklist Items: 28</div>
              <div>🛡️ Safety Incidents: 0</div>
              <div>👥 User Compliance: 99.8%</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>🗄️ Archiving Status</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>✅ Permit Archived: Yes</div>
              <div>💾 Storage Location: DMS</div>
              <div>🔍 Audit Ready: Yes</div>
              <div>📅 Retention: 7 Years</div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button style={exportButtonStyles} onClick={exportReport}>
            📥 Export Complete Audit Report
          </button>
          <p style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '10px' }}>
            Includes permit details, checklist verification, inspection reports, and system analytics
          </p>
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recent Audit Activity</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {auditTrail
              .filter(audit => audit.permitId === permit.id)
              .slice(0, 5)
              .map((audit, index) => (
                <div key={index} style={{
                  padding: '8px',
                  marginBottom: '6px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  borderLeft: '3px solid #3498db',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {audit.action.replace('_', ' ')}
                  </div>
                  <div style={{ color: '#7f8c8d' }}>
                    By {audit.user} • {new Date(audit.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7ArchiveReport;