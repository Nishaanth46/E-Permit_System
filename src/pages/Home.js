import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermit } from '../context/PermitContext';
import { Link } from 'react-router-dom';
import { PERMIT_STATUS } from '../utils/constants';

const containerStyles = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const welcomeStyles = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  marginBottom: '30px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white'
};

const welcomeTitleStyles = {
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '15px',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
};

const welcomeSubtitleStyles = {
  fontSize: '18px',
  opacity: 0.9,
  marginBottom: '25px',
  maxWidth: '600px',
  margin: '0 auto 25px auto'
};

const statsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const statCardStyles = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  textAlign: 'center',
  border: '1px solid #e0e0e0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

const statCardHoverStyles = {
  transform: 'translateY(-5px)',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
};

const statValueStyles = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const statLabelStyles = {
  fontSize: '14px',
  color: '#7f8c8d',
  fontWeight: '600'
};

const quickActionsStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const actionsTitleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '20px',
  textAlign: 'center'
};

const actionsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px'
};

const actionCardStyles = {
  padding: '30px',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  border: '2px solid #e9ecef',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  display: 'block'
};

const actionCardHoverStyles = {
  transform: 'translateY(-8px)',
  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  borderColor: '#3498db',
  backgroundColor: 'white'
};

const actionIconStyles = {
  fontSize: '48px',
  marginBottom: '20px',
  display: 'block'
};

const actionTitleStyles = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '12px'
};

const actionDescriptionStyles = {
  fontSize: '14px',
  color: '#7f8c8d',
  lineHeight: '1.5'
};

const workflowStepsStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  marginBottom: '30px'
};

const stepsTitleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '25px',
  textAlign: 'center'
};

const stepsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px'
};

const stepCardStyles = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  textAlign: 'center'
};

const stepNumberStyles = {
  width: '30px',
  height: '30px',
  backgroundColor: '#3498db',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  margin: '0 auto 10px auto'
};

const stepTitleStyles = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '8px'
};

const stepDescStyles = {
  fontSize: '12px',
  color: '#7f8c8d'
};

const Home = () => {
  const { user } = useAuth();
  const { permits } = usePermit();
  const [hoveredAction, setHoveredAction] = useState(null);

  const userStats = {
    totalPermits: permits.length,
    pendingPermits: permits.filter(p => p.status === PERMIT_STATUS.PENDING).length,
    approvedPermits: permits.filter(p => p.status === PERMIT_STATUS.APPROVED).length,
    inProgressPermits: permits.filter(p => p.status === PERMIT_STATUS.IN_PROGRESS).length,
    completedPermits: permits.filter(p => p.status === PERMIT_STATUS.COMPLETED).length
  };

  const workflowSteps = [
    { number: 1, title: 'Request Initiation', description: 'Submit permit request with work details' },
    { number: 2, title: 'Safety Checklist', description: 'Complete area-specific safety verification' },
    { number: 3, title: 'Inspection', description: 'Safety officer reviews and validates' },
    { number: 4, title: 'Approval', description: 'Management approves the permit' },
    { number: 5, title: 'Issue & Notify', description: 'Generate PDF and send notifications' },
    { number: 6, title: 'Work Execution', description: 'Monitor work with real-time updates' },
    { number: 7, title: 'Closure', description: 'Verify completion and restore area' },
    { number: 8, title: 'Archive & Analytics', description: 'Store records and generate reports' }
  ];

  const quickActions = [
    {
      title: 'Start New Permit',
      description: 'Begin the simplified workflow for a new safety permit',
      icon: '🔄',
      path: '/permit-workflow',
      roles: ['requester', 'safety_officer', 'approver', 'admin'],
      color: '#3498db'
    },
    {
      title: 'Quick Permit Request',
      description: 'Create a simple permit request for standard work',
      icon: '🛡️',
      path: '/new-permit',
      roles: ['requester'],
      color: '#2ecc71'
    },
    {
      title: 'View All Permits',
      description: 'Monitor and manage all permit applications and approvals',
      icon: '📋',
      path: '/permits',
      roles: ['requester', 'safety_officer', 'approver', 'admin'],
      color: '#9b59b6'
    },
    {
      title: 'Safety Dashboard',
      description: 'Real-time analytics and compliance monitoring',
      icon: '📊',
      path: '/dashboard',
      roles: ['safety_officer', 'approver', 'admin'],
      color: '#e74c3c'
    }
  ].filter(action => action.roles.includes(user?.role));

  const handleActionHover = (index) => {
    setHoveredAction(index);
  };

  const handleActionLeave = () => {
    setHoveredAction(null);
  };

  const getWelcomeMessage = () => {
    const messages = {
      requester: 'Create and manage safety permits with simplified workflow.',
      safety_officer: 'Review and validate permit applications for safety compliance.',
      approver: 'Approve permits and monitor work activities across facilities.',
      admin: 'Configure system settings and oversee safety management.'
    };
    return messages[user?.role] || 'Welcome to the E-Permit Safety System.';
  };

  return (
    <div style={containerStyles}>
      {/* Welcome Section */}
      <div style={welcomeStyles}>
        <h1 style={welcomeTitleStyles}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={welcomeSubtitleStyles}>
          {getWelcomeMessage()}
        </p>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          🛡️ {user?.department} • {user?.role?.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Statistics Section */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{userStats.totalPermits}</div>
          <div style={statLabelStyles}>Total Permits</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{userStats.pendingPermits}</div>
          <div style={statLabelStyles}>Pending Approval</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{userStats.approvedPermits}</div>
          <div style={statLabelStyles}>Approved</div>
        </div>
        <div style={statCardStyles}>
          <div style={statValueStyles}>{userStats.completedPermits}</div>
          <div style={statLabelStyles}>Completed</div>
        </div>
      </div>

      {/* 8-Step Workflow Overview - Hidden for Requester Role */}
      {user?.role !== 'requester' && (
        <div style={workflowStepsStyles}>
          <h2 style={stepsTitleStyles}>8-Step Safety Permit Workflow</h2>
          <div style={stepsGridStyles}>
            {workflowSteps.map(step => (
              <div key={step.number} style={stepCardStyles}>
                <div style={stepNumberStyles}>{step.number}</div>
                <div style={stepTitleStyles}>{step.title}</div>
                <div style={stepDescStyles}>{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      <div style={quickActionsStyles}>
        <h2 style={actionsTitleStyles}>Quick Actions</h2>
        <div style={actionsGridStyles}>
          {quickActions.map((action, index) => (
            <Link
              key={action.path}
              to={action.path}
              style={{
                ...actionCardStyles,
                ...(hoveredAction === index ? actionCardHoverStyles : {}),
                borderLeft: `4px solid ${action.color}`
              }}
              onMouseEnter={() => handleActionHover(index)}
              onMouseLeave={handleActionLeave}
            >
              <span style={{...actionIconStyles, color: action.color}}>{action.icon}</span>
              <h3 style={actionTitleStyles}>{action.title}</h3>
              <p style={actionDescriptionStyles}>{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div style={quickActionsStyles}>
        <h2 style={actionsTitleStyles}>System Status</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{fontSize: '12px', color: '#7f8c8d', marginBottom: '5px'}}>Work Areas</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>7</div>
            <div style={{fontSize: '12px', color: '#27ae60'}}>Critical Zones</div>
          </div>
          <div>
            <div style={{fontSize: '12px', color: '#7f8c8d', marginBottom: '5px'}}>Safety Compliance</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>100%</div>
            <div style={{fontSize: '12px', color: '#27ae60'}}>Verified</div>
          </div>
          <div>
            <div style={{fontSize: '12px', color: '#7f8c8d', marginBottom: '5px'}}>Workflow Steps</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>
              {user?.role === 'requester' ? '2' : '8'}
            </div>
            <div style={{fontSize: '12px', color: '#27ae60'}}>
              {user?.role === 'requester' ? 'Simplified Process' : 'Complete Process'}
            </div>
          </div>
          <div>
            <div style={{fontSize: '12px', color: '#7f8c8d', marginBottom: '5px'}}>System Uptime</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>99.9%</div>
            <div style={{fontSize: '12px', color: '#27ae60'}}>This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;