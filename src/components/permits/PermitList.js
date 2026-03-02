import React from 'react';
import { usePermit } from '../../context/PermitContext';
import { formatDate, getStatusColor } from '../../utils/helpers';

const listStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden'
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse'
};

const thStyles = {
  backgroundColor: '#34495e',
  color: 'white',
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px'
};

const tdStyles = {
  padding: '12px 15px',
  borderBottom: '1px solid #ecf0f1',
  fontSize: '14px'
};

const statusBadgeStyles = (status) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  backgroundColor: getStatusColor(status) + '20',
  color: getStatusColor(status),
  border: `1px solid ${getStatusColor(status)}`
});

const actionButtonStyles = {
  padding: '6px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  marginRight: '8px'
};

const viewButtonStyles = {
  ...actionButtonStyles,
  backgroundColor: '#3498db',
  color: 'white'
};

const emptyStateStyles = {
  textAlign: 'center',
  padding: '40px',
  color: '#7f8c8d'
};

const PermitList = ({ onViewPermit }) => {
  const { permits } = usePermit();

  if (permits.length === 0) {
    return (
      <div style={listStyles}>
        <div style={emptyStateStyles}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
          <h3>No Permits Found</h3>
          <p>You haven't created any permit requests yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={listStyles}>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Permit Number</th>
            <th style={thStyles}>Work Area</th>
            <th style={thStyles}>Description</th>
            <th style={thStyles}>Requested</th>
            <th style={thStyles}>Status</th>
            <th style={thStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map(permit => (
            <tr key={permit.id}>
              <td style={tdStyles}>
                <strong>{permit.permitNumber}</strong>
              </td>
              <td style={tdStyles}>{permit.workArea}</td>
              <td style={tdStyles}>
                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {permit.workDescription}
                </div>
              </td>
              <td style={tdStyles}>{formatDate(permit.createdAt)}</td>
              <td style={tdStyles}>
                <span style={statusBadgeStyles(permit.status)}>
                  {permit.status.toUpperCase()}
                </span>
              </td>
              <td style={tdStyles}>
                <button 
                  style={viewButtonStyles}
                  onClick={() => onViewPermit(permit)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermitList;