import React from 'react';
import { usePermit } from '../../context/PermitContext';
import { WORK_AREAS, PERMIT_STATUS } from '../../utils/constants';

const analyticsStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const chartContainerStyles = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '15px'
};

const chartTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const statItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #e9ecef'
};

const statLabelStyles = {
  fontSize: '14px',
  color: '#7f8c8d'
};

const statValueStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#2c3e50'
};

const progressBarStyles = {
  height: '8px',
  backgroundColor: '#ecf0f1',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '5px'
};

const progressFillStyles = (percentage, color) => ({
  height: '100%',
  width: `${percentage}%`,
  backgroundColor: color,
  borderRadius: '4px',
  transition: 'width 0.3s ease'
});

const EnhancedAnalytics = () => {
  const { permits, getPermitsByStatus, getPermitsByWorkArea } = usePermit();

  // Calculate statistics
  const stats = {
    total: permits.length,
    pending: getPermitsByStatus('pending').length,
    under_review: getPermitsByStatus('under_review').length,
    approved: getPermitsByStatus('approved').length,
    in_progress: getPermitsByStatus('in_progress').length,
    completed: getPermitsByStatus('completed').length,
    rejected: getPermitsByStatus('rejected').length
  };

  // Calculate permits by work area
  const areaStats = WORK_AREAS.map(area => {
    const count = getPermitsByWorkArea(area.code).length;
    const percentage = permits.length > 0 ? (count / permits.length) * 100 : 0;
    return { ...area, count, percentage };
  });

  // Calculate status distribution
  const statusDistribution = Object.entries(PERMIT_STATUS).map(([key, status]) => ({
    status,
    count: getPermitsByStatus(status).length,
    percentage: permits.length > 0 ? (getPermitsByStatus(status).length / permits.length) * 100 : 0
  }));

  const getStatusColor = (status) => {
    const colors = {
      [PERMIT_STATUS.PENDING]: '#f39c12',
      [PERMIT_STATUS.UNDER_REVIEW]: '#3498db',
      [PERMIT_STATUS.APPROVED]: '#27ae60',
      [PERMIT_STATUS.IN_PROGRESS]: '#9b59b6',
      [PERMIT_STATUS.COMPLETED]: '#2ecc71',
      [PERMIT_STATUS.REJECTED]: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div style={analyticsStyles}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Advanced Analytics</h3>
      
      <div style={gridStyles}>
        {/* Work Area Distribution */}
        <div style={chartContainerStyles}>
          <h4 style={chartTitleStyles}>Permits by Work Area</h4>
          {areaStats.map(area => (
            <div key={area.code} style={statItemStyles}>
              <span style={statLabelStyles}>{area.name}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={statValueStyles}>{area.count}</div>
                <div style={progressBarStyles}>
                  <div style={progressFillStyles(area.percentage, '#3498db')}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Distribution */}
        <div style={chartContainerStyles}>
          <h4 style={chartTitleStyles}>Status Distribution</h4>
          {statusDistribution.map(item => (
            <div key={item.status} style={statItemStyles}>
              <span style={statLabelStyles}>
                {item.status.replace('_', ' ').toUpperCase()}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={statValueStyles}>{item.count}</div>
                <div style={progressBarStyles}>
                  <div style={progressFillStyles(item.percentage, getStatusColor(item.status))}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Level Overview */}
        <div style={chartContainerStyles}>
          <h4 style={chartTitleStyles}>Risk Level Overview</h4>
          {WORK_AREAS.map(area => {
            const areaPermits = getPermitsByWorkArea(area.code);
            const activePermits = areaPermits.filter(p => 
              ['pending', 'under_review', 'approved', 'in_progress'].includes(p.status)
            ).length;
            
            return (
              <div key={area.code} style={statItemStyles}>
                <span style={statLabelStyles}>
                  {area.name} 
                  <span style={{ 
                    fontSize: '10px', 
                    backgroundColor: area.riskLevel === 'High' ? '#e74c3c' : '#f39c12',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginLeft: '8px'
                  }}>
                    {area.riskLevel}
                  </span>
                </span>
                <span style={statValueStyles}>{activePermits} active</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={chartContainerStyles}>
        <h4 style={chartTitleStyles}>Quick Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{stats.total}</div>
            <div style={statLabelStyles}>Total Permits</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
              {stats.pending + stats.under_review}
            </div>
            <div style={statLabelStyles}>Pending Review</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.approved + stats.in_progress}
            </div>
            <div style={statLabelStyles}>Active Work</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{stats.completed}</div>
            <div style={statLabelStyles}>Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;