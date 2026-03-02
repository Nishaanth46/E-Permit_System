import React from 'react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { WORKFLOW_STEPS } from '../../utils/constants';

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
  zIndex: 1000,
  padding: '20px'
};

const contentStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '1000px',
  maxHeight: '90vh',
  overflow: 'auto'
};

const headerStyles = {
  padding: '20px',
  borderBottom: '1px solid #ecf0f1',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa'
};

const titleStyles = {
  margin: 0,
  color: '#2c3e50',
  fontSize: '24px'
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
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '6px',
  border: '1px solid #e9ecef'
};

const sectionTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '2px solid #3498db'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px'
};

const infoItemStyles = {
  marginBottom: '15px'
};

const labelStyles = {
  fontWeight: '600',
  color: '#34495e',
  fontSize: '14px',
  marginBottom: '5px',
  display: 'block'
};

const valueStyles = {
  color: '#2c3e50',
  fontSize: '14px'
};

const workflowContainerStyles = {
  marginTop: '20px'
};

const workflowStepStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px'
};

const stepIndicatorStyles = (completed) => ({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: completed ? '#27ae60' : '#bdc3c7',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '15px',
  fontWeight: 'bold'
});

const stepInfoStyles = {
  flex: 1
};

const stepTitleStyles = {
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '5px'
};

const stepMetaStyles = {
  fontSize: '12px',
  color: '#7f8c8d'
};

const EnhancedPermitDetails = ({ permit, onClose, onApprove, onReject, currentUser }) => {
  if (!permit) return null;

  const canApprove = currentUser?.role === 'safety_officer' || currentUser?.role === 'approver';
  const isPending = permit.status === 'pending' || permit.status === 'under_review';

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={contentStyles} onClick={e => e.stopPropagation()}>
        <div style={headerStyles}>
          <div>
            <h2 style={titleStyles}>
              Safety Permit: {permit.permitNumber}
            </h2>
            <div style={{ 
              display: 'inline-block', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              backgroundColor: getStatusColor(permit.status) + '20',
              color: getStatusColor(permit.status),
              border: `1px solid ${getStatusColor(permit.status)}`,
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {permit.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <button style={closeButtonStyles} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={bodyStyles}>
          {/* Basic Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Basic Information</h3>
            <div style={gridStyles}>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Work Area</span>
                <div style={valueStyles}>{permit.workArea}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Requester</span>
                <div style={valueStyles}>{permit.requesterName}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Location</span>
                <div style={valueStyles}>{permit.location}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Requested Date</span>
                <div style={valueStyles}>{formatDate(permit.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Work Details</h3>
            <div style={infoItemStyles}>
              <span style={labelStyles}>Work Description</span>
              <div style={valueStyles}>{permit.workDescription}</div>
            </div>
            <div style={gridStyles}>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Start Date & Time</span>
                <div style={valueStyles}>{formatDate(permit.startDate)}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>End Date & Time</span>
                <div style={valueStyles}>{formatDate(permit.endDate)}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Workers Involved</span>
                <div style={valueStyles}>{permit.workersInvolved}</div>
              </div>
              <div style={infoItemStyles}>
                <span style={labelStyles}>Equipment</span>
                <div style={valueStyles}>{permit.equipment || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Safety Checklist */}
          {permit.safetyChecklist && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Safety Checklist</h3>
              {Object.entries(permit.safetyChecklist.answers || {}).map(([questionId, answer]) => {
                const question = permit.safetyChecklist.questions?.find(q => q.id === parseInt(questionId)) || 
                                { question: `Question ${questionId}` };
                
                return (
                  <div key={questionId} style={{
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: String(answer) === 'yes' ? '#d5f4e6' : '#fadbd8',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${String(answer) === 'yes' ? '#27ae60' : '#e74c3c'}`,
                  }}>
                    <div style={labelStyles}>{question.question}</div>
                    <div style={valueStyles}>
                      Answer: <strong style={{ color: String(answer) === 'yes' ? '#27ae60' : '#e74c3c' }}>
                        {String(answer).toUpperCase()}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Workflow Timeline */}
          {permit.workflow && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Approval Workflow</h3>
              <div style={workflowContainerStyles}>
                {permit.workflow.map((step, index) => (
                  <div key={index} style={workflowStepStyles}>
                    <div style={stepIndicatorStyles(step.status === 'completed')}>
                      {step.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div style={stepInfoStyles}>
                      <div style={stepTitleStyles}>{step.step}</div>
                      {step.timestamp && (
                        <div style={stepMetaStyles}>
                          By {step.user} on {formatDate(step.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons for Safety Officers/Approvers */}
          {canApprove && isPending && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Actions</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onClick={() => onApprove(permit.id)}
                >
                  Approve Permit
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) onReject(permit.id, reason);
                  }}
                >
                  Reject Permit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPermitDetails;