import React from 'react';
import { useAuth } from '../../context/AuthContext';

const headerStyles = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '0 20px',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const logoStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const userInfoStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const userDetailsStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
};

const userNameStyles = {
  fontWeight: 'bold',
  fontSize: '14px'
};

const userRoleStyles = {
  fontSize: '12px',
  opacity: 0.8,
  textTransform: 'capitalize'
};

const avatarStyles = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#3498db',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '16px'
};

const logoutButtonStyles = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.3)',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.3s ease'
};

const logoutButtonHoverStyles = {
  backgroundColor: 'rgba(231, 76, 60, 0.1)',
  borderColor: '#e74c3c'
};

const Header = () => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header style={headerStyles}>
      <div style={logoStyles}>
        <span style={{ fontSize: '28px' }}>🛡️</span>
        <span>E-Permit System</span>
      </div>
      
      {user && (
        <div style={userInfoStyles}>
          <div style={userDetailsStyles}>
            <div style={userNameStyles}>{user.name}</div>
            <div style={userRoleStyles}>
              {user.role.replace('_', ' ')} • {user.department}
            </div>
          </div>
          <div style={avatarStyles}>
            {user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <button 
            style={{
              ...logoutButtonStyles,
              ...(isHovered ? logoutButtonHoverStyles : {})
            }}
            onClick={handleLogout}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;