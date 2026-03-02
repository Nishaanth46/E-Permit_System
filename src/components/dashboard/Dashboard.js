import React from 'react';
import StatsCards from './StatsCards';
import EnhancedAnalytics from './EnhancedAnalytics';

const dashboardStyles = {
  padding: '20px'
};

const welcomeStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '30px'
};

const welcomeTitleStyles = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const welcomeSubtitleStyles = {
  fontSize: '16px',
  color: '#7f8c8d',
  marginBottom: '20px'
};

const Dashboard = () => {
  return (
    <div style={dashboardStyles}>
      <div style={welcomeStyles}>
        <h1 style={welcomeTitleStyles}>E-Permit Safety Dashboard</h1>
        <p style={welcomeSubtitleStyles}>
          Monitor safety permits, track approvals, and ensure workplace safety compliance across all 7 critical work areas.
        </p>
      </div>

      <StatsCards />
      <EnhancedAnalytics />
    </div>
  );
};

export default Dashboard;