// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sidebarStyles = {
  width: '250px',
  backgroundColor: '#34495e',
  color: 'white',
  position: 'fixed',
  height: 'calc(100vh - 60px)',
  padding: '20px 0',
  overflowY: 'auto',
  left: 0,
  top: '60px',
  transition: 'transform 0.3s ease'
};

const menuListStyles = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const menuItemStyles = {
  padding: '12px 20px',
  borderLeft: '4px solid transparent',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const activeMenuItemStyles = {
  ...menuItemStyles,
  backgroundColor: '#2c3e50',
  borderLeft: '4px solid #3498db'
};

const menuLinkStyles = {
  color: 'white',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px',
  fontWeight: '500',
  width: '100%'
};

const menuIconStyles = {
  width: '20px',
  textAlign: 'center',
  fontSize: '16px'
};

const badgeStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  borderRadius: '10px',
  padding: '2px 8px',
  fontSize: '10px',
  fontWeight: 'bold',
  marginLeft: 'auto'
};

const workflowBadgeStyles = {
  ...badgeStyles,
  backgroundColor: '#3498db'
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: '🏠', 
      roles: ['requester', 'safety_officer', 'approver', 'admin'] 
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: '📊', 
      roles: ['safety_officer', 'approver', 'inspector'],
      badge: 'Analytics'
    },
    { 
      path: '/permits', 
      label: 'My Permits', 
      icon: '📋', 
      roles: ['requester'] 
    },
    { 
      path: '/admin', 
      label: 'Admin Panel', 
      icon: '⚙️', 
      roles: ['admin'],
      badge: 'Admin'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside style={sidebarStyles}>
      <nav>
        <ul style={menuListStyles}>
          {filteredMenuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li 
                key={item.path}
                style={isActive ? activeMenuItemStyles : menuItemStyles}
              >
                <Link to={item.path} style={menuLinkStyles}>
                  <span style={menuIconStyles}>{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span style={item.path === '/workflow' ? workflowBadgeStyles : badgeStyles}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Info Footer */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #2c3e50',
        marginTop: '20px',
        fontSize: '12px',
        color: '#bdc3c7',
        textAlign: 'center'
      }}>
        <div>E-Permit System v2.0</div>
        <div style={{ marginTop: '5px', fontSize: '10px' }}>
          Safety Permit System 🛡️
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
          Logged in as:<br />
          <strong>{user?.name}</strong><br />
          {user?.role?.replace('_', ' ')}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;