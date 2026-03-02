import React, { useState } from 'react';
import PermitList from '../components/permits/PermitList';
import EnhancedPermitDetails from '../components/permits/EnhancedPermitDetails';
import { usePermit } from '../context/PermitContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const containerStyles = {
  padding: '20px',
  maxWidth: '1200px',
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

const PermitsPage = () => {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const { approvePermit, rejectPermit } = usePermit();
  const { user } = useAuth();

  const handleViewPermit = (permit) => {
    setSelectedPermit(permit);
  };

  const handleCloseDetails = () => {
    setSelectedPermit(null);
  };

  const handleApprovePermit = (permitId) => {
    approvePermit(permitId, user.name);
    toast.success('Permit approved successfully!');
    setSelectedPermit(null);
  };

  const handleRejectPermit = (permitId, reason) => {
    rejectPermit(permitId, user.name, reason);
    toast.success('Permit rejected!');
    setSelectedPermit(null);
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Permit Management</h1>
          <p style={subtitleStyles}>
            View, manage, and track all safety permit applications
          </p>
        </div>
      </div>

      <PermitList onViewPermit={handleViewPermit} />
      
      {selectedPermit && (
        <EnhancedPermitDetails 
          permit={selectedPermit} 
          onClose={handleCloseDetails}
          onApprove={handleApprovePermit}
          onReject={handleRejectPermit}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default PermitsPage;