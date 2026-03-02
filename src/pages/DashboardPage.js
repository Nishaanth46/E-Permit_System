import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import EnhancedAnalytics from '../components/dashboard/EnhancedAnalytics';
import StatsCards from '../components/dashboard/StatsCards';

const containerStyles = {
  padding: '20px',
  maxWidth: '1400px',
  margin: '0 auto'
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const titleStyles = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: 0
};

const subtitleStyles = {
  fontSize: '16px',
  color: '#7f8c8d',
  marginTop: '5px'
};

const DashboardPage = () => {
  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Safety Permit Dashboard</h1>
          <p style={subtitleStyles}>
            Real-time monitoring of safety permits and compliance metrics
          </p>
        </div>
      </div>
      
      <StatsCards />
      <EnhancedAnalytics />
    </div>
  );
};

export default DashboardPage;