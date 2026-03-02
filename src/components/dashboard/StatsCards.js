import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermit } from '../../context/PermitContext';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../common/DashboardCard';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const StatsCards = () => {
  const navigate = useNavigate();
  const { permits } = usePermit();
  const { user } = useAuth();

  const stats = {
    total: permits.length,
    pending: permits.filter(p => p.status === 'pending').length,
    approved: permits.filter(p => p.status === 'approved').length,
    rejected: permits.filter(p => p.status === 'rejected').length,
    completed: permits.filter(p => p.status === 'completed').length
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Role-specific cards
  const getRoleSpecificCards = () => {
    switch (user?.role) {
      case 'safety_officer':
        return [
          {
            title: 'Verify Checklist',
            value: 'Safety Review',
            icon: '✅',
            footer: 'Click to access',
            iconColor: '#27ae60',
            path: '/workflow/step2'
          },
          {
            title: 'Close Permit',
            value: 'Final Closure',
            icon: '🔒',
            footer: 'Click to access',
            iconColor: '#e74c3c',
            path: '/workflow/step6'
          }
        ];
      case 'inspector':
        return [
          {
            title: 'Inspect Work Area',
            value: 'Site Inspection',
            icon: '🔍',
            footer: 'Click to access',
            iconColor: '#f39c12',
            path: '/workflow/step3'
          }
        ];
      case 'approver':
        return [
          {
            title: 'Approve Permit',
            value: 'Permit Approval',
            icon: '✓',
            footer: 'Click to access',
            iconColor: '#3498db',
            path: '/workflow/step4'
          }
        ];
      case 'requester':
        return [
          {
            title: 'Request Permit',
            value: 'New Permit',
            icon: '📝',
            footer: 'Click to access',
            iconColor: '#9b59b6',
            path: '/workflow/step1'
          },
          {
            title: 'Execute Work',
            value: 'Work Execution',
            icon: '🔧',
            footer: 'Click to access',
            iconColor: '#e67e22',
            path: '/workflow/step5'
          }
        ];
      default:
        return [];
    }
  };

  const cards = getRoleSpecificCards();

  return (
    <div style={gridStyles}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          onClick={() => handleCardClick(card.path)}
          style={{ cursor: 'pointer' }}
        >
          <DashboardCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            footer={card.footer}
            iconColor={card.iconColor}
          />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;