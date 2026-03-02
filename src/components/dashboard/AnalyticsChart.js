import React from 'react';
import { usePermit } from '../../context/PermitContext';

const chartContainerStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const chartTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '20px'
};

const chartStyles = {
  height: '300px',
  display: 'flex',
  alignItems: 'flex-end',
  gap: '10px',
  padding: '20px 0'
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
  padding: '10px 0'
});

const barLabelStyles = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '12px',
  marginBottom: '5px'
};

const barValueStyles = {
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold'
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
  fontSize: '12px',
  color: '#7f8c8d'
};

const AnalyticsChart = () => {
  const { permits, workAreas } = usePermit();

  // Calculate permits by work area
  const areaStats = workAreas.map(area => {
    const count = permits.filter(p => p.workArea === area.code).length;
    return {
      name: area.name,
      count: count,
      percentage: permits.length > 0 ? (count / permits.length) * 100 : 0
    };
  });

  const maxCount = Math.max(...areaStats.map(stat => stat.count), 1);

  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

  return (
    <div style={chartContainerStyles}>
      <h3 style={chartTitleStyles}>Permits by Work Area</h3>
      
      <div style={chartStyles}>
        {areaStats.map((stat, index) => (
          <div 
            key={stat.name}
            style={barStyles(
              (stat.count / maxCount) * 80 + 20, // Minimum 20% height for visibility
              colors[index % colors.length]
            )}
            title={`${stat.name}: ${stat.count} permits`}
          >
            <div style={barValueStyles}>{stat.count}</div>
            <div style={barLabelStyles}>{stat.name}</div>
          </div>
        ))}
      </div>

      <div style={xAxisStyles}>
        {areaStats.map(stat => (
          <div key={stat.name} style={xAxisLabelStyles}>
            {stat.name}
          </div>
        ))}
      </div>

      {permits.length === 0 && (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
          No data available for analytics
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;