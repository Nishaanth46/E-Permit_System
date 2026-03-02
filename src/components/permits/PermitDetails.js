import React from 'react';
import { formatDate, getStatusColor } from '../../utils/helpers';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const contentStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflow: 'auto'
};

const headerStyles = {
  padding: '20px',
  borderBottom: '1px solid #ecf0f1',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyles = {
  margin: 0,
  color: '#2c3e50'
};

const closeButtonStyles = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#7f8c8d'
};

const bodyStyles = {
  padding: '20px'
};

const sectionStyles = {
  marginBottom: '30px'
};

const sectionTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  paddingBottom: '8px',
  borderBottom: '1px solid #ecf0f1'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px'
};

const infoItemStyles = {
  marginBottom: '10px'
};

const labelStyles = {
  fontWeight: '600',
  color: '#34495e',
  fontSize: '14px',
  marginBottom: '4px'
};

const valueStyles = {
  color: '#2c3e50'
};

const checklistItemStyles = {
  padding: '10px',
  marginBottom: '8px',
  backgroundColor: '#f8f9fa',
  borderRadius: '4px',
  borderLeft: '4px solid #3498db'
};

const PermitDetails = ({ permit, onClose }) => {
  if (!permit) return null;

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={contentStyles} onClick={e => e.stopPropagation()}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>
            Permit Details: {permit.permitNumber}
          </h2>
          <button style={closeButtonStyles} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={bodyStyles}>
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Basic Information</h3>
            <div style={gridStyles}>
              <div style={infoItemStyles}>
                <div style={labelStyles}>Status</div>
                <div style={{...valueStyles, display: 'inline-block', ...getStatusColor(permit.status)}}>
                  {permit.status.toUpperCase()}
                </div>
              </div>
              <div style={infoItemStyles}>
                <div style={labelStyles}>Work Area</div>
                <div style={valueStyles}>{permit.workArea}</div>
              </div>
              <div style={infoItemStyles}>
                <div style={labelStyles}>Requester</div>
                <div style={valueStyles}>{permit.requesterName}</div>
              </div>
              <div style={infoItemStyles}>
                <div style={labelStyles}>Requested Date</div>
                <div style={valueStyles}>{formatDate(permit.createdAt)}</div>
              </div>
            </div>
          </div>

          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Work Details</h3>
            <div style={infoItemStyles}>
              <div style={labelStyles}>Location</div>
              <div style={valueStyles}>{permit.location}</div>
            </div>
            <div style={infoItemStyles}>
              <div style={labelStyles}>Work Description</div>
              <div style={valueStyles}>{permit.workDescription}</div>
            </div>
            <div style={gridStyles}>
              <div style={infoItemStyles}>
                <div style={labelStyles}>Start Date & Time</div>
                <div style={valueStyles}>{formatDate(permit.startDate)}</div>
              </div>
              <div style={infoItemStyles}>
                <div style={labelStyles}>End Date & Time</div>
                <div style={valueStyles}>{formatDate(permit.endDate)}</div>
              </div>
            </div>
            <div style={infoItemStyles}>
              <div style={labelStyles}>Workers Involved</div>
              <div style={valueStyles}>{permit.workersInvolved}</div>
            </div>
          </div>

          {permit.safetyChecklist && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Safety Checklist</h3>
              {Object.entries(permit.safetyChecklist.answers || {}).map(([questionId, answer]) => (
                <div key={questionId} style={checklistItemStyles}>
                  <div style={labelStyles}>Question {questionId}</div>
                  <div style={valueStyles}>
                    Answer: <strong>{answer}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermitDetails;