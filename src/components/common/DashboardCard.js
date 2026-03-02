import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }
};

const cardHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const cardTitleStyles = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '600',
  color: '#333'
};

const cardIconStyles = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px'
};

const cardValueStyles = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#2c3e50',
  marginBottom: '10px'
};

const cardFooterStyles = {
  fontSize: '14px',
  color: '#7f8c8d'
};

const DashboardCard = ({ title, value, icon, footer, iconColor = '#3498db', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div style={cardStyles} onClick={handleClick}>
      <div style={cardHeaderStyles}>
        <h3 style={cardTitleStyles}>{title}</h3>
        <div style={{...cardIconStyles, backgroundColor: `${iconColor}20`}}>
          {icon}
        </div>
      </div>
      <div style={cardValueStyles}>{value}</div>
      <div style={cardFooterStyles}>
        {footer}
        <div 
          style={{ 
            color: '#3498db', 
            marginTop: '10px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          Click to access →
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;