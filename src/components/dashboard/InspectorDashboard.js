import React from 'react';
import { FaClipboardList, FaClipboardCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const dashboardStyles = {
  padding: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif'
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const welcomeStyles = {
  marginBottom: '10px'
};

const welcomeTitle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#2c3e50',
  margin: '0 0 5px 0'
};

const roleBadge = {
  display: 'inline-block',
  backgroundColor: '#e8f4f8',
  color: '#2c8ac8',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const statCard = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const statIcon = {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  color: 'white'
};

const statInfo = {
  flex: 1
};

const statValue = {
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 5px 0',
  color: '#2c3e50'
};

const statLabel = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '0'
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2c3e50',
  margin: '0 0 15px 0'
};

const workflowCard = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  marginBottom: '20px',
  borderLeft: '4px solid #f39c12'
};

const workflowHeader = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px'
};

const stepNumber = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: '#f39c12',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '15px',
  fontWeight: 'bold',
  fontSize: '14px'
};

const workflowTitle = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  color: '#2c3e50'
};

const workflowDescription = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '5px 0 0 0'
};

const accessLink = {
  display: 'inline-block',
  color: '#2c8ac8',
  textDecoration: 'none',
  fontSize: '14px',
  marginTop: '15px',
  fontWeight: '500',
  '&:hover': {
    textDecoration: 'underline'
  }
};

const InspectorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample data - replace with actual data from your API
  const stats = {
    pendingTasks: 3,
    totalTasks: 12
  };

  const handleInspectClick = () => {
    navigate('/workflow/inspect');
  };

  return (
    <div style={dashboardStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={welcomeTitle}>Welcome back, {user?.name || 'Inspector'}!</h1>
          <div style={roleBadge}>Inspector • Quality</div>
        </div>
      </div>

      <div style={statsContainer}>
        <div style={statCard}>
          <div style={{ ...statIcon, backgroundColor: '#f39c12' }}>
            <FaClipboardList />
          </div>
          <div style={statInfo}>
            <p style={statValue}>{stats.pendingTasks}</p>
            <p style={statLabel}>Pending tasks</p>
          </div>
        </div>
        <div style={statCard}>
          <div style={{ ...statIcon, backgroundColor: '#2ecc71' }}>
            <FaClipboardCheck />
          </div>
          <div style={statInfo}>
            <p style={statValue}>{stats.totalTasks}</p>
            <p style={statLabel}>Total</p>
          </div>
        </div>
      </div>

      <div>
        <h2 style={sectionTitle}>Your Workflow Responsibilities</h2>
        <div style={workflowCard}>
          <div style={workflowHeader}>
            <div style={stepNumber}>3</div>
            <h3 style={workflowTitle}>Inspect Work Area</h3>
          </div>
          <p style={workflowDescription}>
            Conduct physical site inspections and verify safety measures are in place.
          </p>
          <a 
            href="#" 
            style={accessLink} 
            onClick={(e) => {
              e.preventDefault();
              handleInspectClick();
            }}
          >
            Click to access
          </a>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
