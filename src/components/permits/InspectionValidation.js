import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '900px',
  margin: '0 auto'
};

const headerStyles = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #f8f9fa'
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const permitInfoStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const infoGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  fontSize: '14px'
};

const infoItemStyles = {
  marginBottom: '8px'
};

const infoLabelStyles = {
  fontWeight: '600',
  color: '#2c3e50',
  marginRight: '8px'
};

const checklistReviewStyles = {
  marginBottom: '30px'
};

const questionItemStyles = {
  padding: '15px',
  marginBottom: '15px',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  borderLeft: '4px solid #3498db'
};

const compliantQuestionStyles = {
  ...questionItemStyles,
  borderLeftColor: '#27ae60',
  backgroundColor: '#f0f9f0'
};

const nonCompliantQuestionStyles = {
  ...questionItemStyles,
  borderLeftColor: '#e74c3c',
  backgroundColor: '#fdf0f0'
};

const questionTextStyles = {
  fontWeight: '600',
  marginBottom: '10px',
  color: '#2c3e50'
};

const photoPreviewStyles = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  margin: '10px 0'
};

const previewImageStyles = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '6px',
  border: '2px solid #bdc3c7',
  cursor: 'pointer'
};

const actionSectionStyles = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const textareaStyles = {
  width: '100%',
  padding: '12px',
  border: '1px solid #dcdfe6',
  borderRadius: '6px',
  fontSize: '14px',
  minHeight: '100px',
  resize: 'vertical',
  marginBottom: '15px'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'flex-end'
};

const approveButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const rejectButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const requestChangesButtonStyles = {
  backgroundColor: '#f39c12',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const InspectionValidation = ({ permit, onApprove, onReject, onRequestChanges }) => {
  const { user } = useAuth();
  const [inspectorRemarks, setInspectorRemarks] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState({});

  const handleApprove = () => {
    if (!inspectorRemarks.trim()) {
      toast.error('Please provide inspection remarks');
      return;
    }
    onApprove({
      inspector: user.name,
      remarks: inspectorRemarks,
      inspectedAt: new Date().toISOString()
    });
  };

  const handleReject = () => {
    if (!inspectorRemarks.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }
    onReject({
      inspector: user.name,
      reason: inspectorRemarks,
      rejectedAt: new Date().toISOString()
    });
  };

  const handleRequestChanges = () => {
    if (!inspectorRemarks.trim()) {
      toast.error('Please specify required changes');
      return;
    }
    onRequestChanges({
      inspector: user.name,
      changesRequired: inspectorRemarks,
      requestedAt: new Date().toISOString()
    });
  };

  const togglePhotoView = (questionId, photoIndex) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [`${questionId}-${photoIndex}`]: !prev[`${questionId}-${photoIndex}`]
    }));
  };

  const getQuestionStyle = (answer) => {
    if (answer?.answer === 'compliant') return compliantQuestionStyles;
    if (answer?.answer === 'not-compliant') return nonCompliantQuestionStyles;
    return questionItemStyles;
  };

  const getStatusIcon = (answer) => {
    if (answer?.answer === 'compliant') return '✅';
    if (answer?.answer === 'not-compliant') return '❌';
    if (answer?.answer === 'not-applicable') return '⚪';
    return '❓';
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>🔍 Inspection & Validation</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Safety Officer: <strong>{user?.name}</strong>
        </p>
      </div>

      {/* Permit Information */}
      <div style={permitInfoStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Permit Details</h3>
        <div style={infoGridStyles}>
          <div style={infoItemStyles}>
            <span style={infoLabelStyles}>Permit #:</span>
            {permit.permitNumber}
          </div>
          <div style={infoItemStyles}>
            <span style={infoLabelStyles}>Work Area:</span>
            {permit.workArea}
          </div>
          <div style={infoItemStyles}>
            <span style={infoLabelStyles}>Location:</span>
            {permit.location}
          </div>
          <div style={infoItemStyles}>
            <span style={infoLabelStyles}>Requester:</span>
            {permit.requesterName}
          </div>
        </div>
      </div>

      {/* Checklist Review */}
      <div style={checklistReviewStyles}>
        <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Safety Checklist Review</h3>
        
        {Object.entries(permit.safetyChecklist?.answers || {}).map(([questionId, answer]) => {
          const question = permit.safetyChecklist.questions?.find(q => q.id === parseInt(questionId)) || 
                          { question: `Question ${questionId}` };
          
          return (
            <div key={questionId} style={getQuestionStyle(answer)}>
              <div style={questionTextStyles}>
                {getStatusIcon(answer)} {question.question}
              </div>
              
              <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '10px' }}>
                Verified by: {answer.verifiedBy} at {new Date(answer.timestamp).toLocaleString()}
              </div>

              {/* Photo Evidence */}
              {permit.safetyChecklist.photos?.[questionId] && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Photo Evidence ({permit.safetyChecklist.photos[questionId].length})
                  </div>
                  <div style={photoPreviewStyles}>
                    {permit.safetyChecklist.photos[questionId].map((photo, index) => (
                      <div key={index}>
                        <img 
                          src={photo.url} 
                          alt={`Evidence ${index + 1}`}
                          style={previewImageStyles}
                          onClick={() => togglePhotoView(questionId, index)}
                        />
                        {selectedPhotos[`${questionId}-${index}`] && (
                          <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                          }}>
                            <img 
                              src={photo.url} 
                              alt={`Evidence ${index + 1}`}
                              style={{ maxWidth: '90%', maxHeight: '90%' }}
                              onClick={() => togglePhotoView(questionId, index)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inspector Actions */}
      <div style={actionSectionStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Inspection Remarks</h3>
        <textarea
          value={inspectorRemarks}
          onChange={(e) => setInspectorRemarks(e.target.value)}
          style={textareaStyles}
          placeholder="Enter your inspection findings, observations, and recommendations..."
        />
        
        <div style={buttonGroupStyles}>
          <button 
            type="button" 
            style={requestChangesButtonStyles}
            onClick={handleRequestChanges}
          >
            Request Changes
          </button>
          <button 
            type="button" 
            style={rejectButtonStyles}
            onClick={handleReject}
          >
            Reject Permit
          </button>
          <button 
            type="button" 
            style={approveButtonStyles}
            onClick={handleApprove}
          >
            Approve & Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionValidation;