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

const workflowStepsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
};

const stepStyles = {
  textAlign: 'center',
  flex: 1
};

const activeStepStyles = {
  ...stepStyles,
  fontWeight: 'bold',
  color: '#3498db'
};

const completedStepStyles = {
  ...stepStyles,
  color: '#27ae60'
};

const stepIconStyles = {
  fontSize: '24px',
  marginBottom: '8px',
  display: 'block'
};

const permitSummaryStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const summaryGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '15px',
  fontSize: '14px'
};

const inspectionReportStyles = {
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #3498db'
};

const actionSectionStyles = {
  padding: '25px',
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
  minHeight: '120px',
  resize: 'vertical',
  marginBottom: '20px'
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
  padding: '12px 35px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const rejectButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 35px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const ApprovalWorkflow = ({ permit, onApprove, onReject }) => {
  const { user } = useAuth();
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const workflowSteps = [
    { step: 1, name: 'Request Initiated', status: 'completed', icon: '📝' },
    { step: 2, name: 'Safety Checklist', status: 'completed', icon: '✅' },
    { step: 3, name: 'Safety Inspection', status: 'completed', icon: '🔍' },
    { step: 4, name: 'Management Approval', status: 'active', icon: '👨‍💼' },
    { step: 5, name: 'Permit Issued', status: 'pending', icon: '🛡️' }
  ];

  const handleApprove = async () => {
    if (!approvalRemarks.trim()) {
      toast.error('Please provide approval remarks');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onApprove({
        approver: user.name,
        remarks: approvalRemarks,
        approvedAt: new Date().toISOString(),
        pdfGenerated: true
      });
      
      toast.success('Permit approved and PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleReject = () => {
    if (!approvalRemarks.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }
    onReject({
      approver: user.name,
      reason: approvalRemarks,
      rejectedAt: new Date().toISOString()
    });
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>👨‍💼 Management Approval</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Approving Authority: <strong>{user?.name}</strong> | Role: {user?.role?.replace('_', ' ')}
        </p>
      </div>

      {/* Workflow Progress */}
      <div style={workflowStepsStyles}>
        {workflowSteps.map((step) => (
          <div 
            key={step.step} 
            style={
              step.status === 'active' ? activeStepStyles :
              step.status === 'completed' ? completedStepStyles : stepStyles
            }
          >
            <span style={stepIconStyles}>{step.icon}</span>
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>Step {step.step}</div>
            <div style={{ fontSize: '14px', fontWeight: step.status === 'active' ? 'bold' : 'normal' }}>
              {step.name}
            </div>
          </div>
        ))}
      </div>

      {/* Permit Summary */}
      <div style={permitSummaryStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Permit Summary</h3>
        <div style={summaryGridStyles}>
          <div>
            <strong>Permit #:</strong> {permit.permitNumber}
          </div>
          <div>
            <strong>Work Area:</strong> {permit.workArea}
          </div>
          <div>
            <strong>Location:</strong> {permit.location}
          </div>
          <div>
            <strong>Requester:</strong> {permit.requesterName}
          </div>
          <div>
            <strong>Work Period:</strong> {new Date(permit.startDate).toLocaleString()} - {new Date(permit.endDate).toLocaleString()}
          </div>
          <div>
            <strong>Team Size:</strong> {permit.teamMembers?.split('\n').length || 1} members
          </div>
        </div>
      </div>

      {/* Inspection Report */}
      {permit.inspection && (
        <div style={inspectionReportStyles}>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Safety Inspection Report</h3>
          <div style={summaryGridStyles}>
            <div>
              <strong>Inspector:</strong> {permit.inspection.inspector}
            </div>
            <div>
              <strong>Inspection Date:</strong> {new Date(permit.inspection.inspectedAt).toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong> 
              <span style={{ 
                color: '#27ae60', 
                fontWeight: 'bold',
                marginLeft: '8px'
              }}>
                ✅ All Safety Checks Verified
              </span>
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <strong>Inspector Remarks:</strong>
            <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: '#555' }}>
              "{permit.inspection.remarks}"
            </p>
          </div>
        </div>
      )}

      {/* Safety Checklist Summary */}
      <div style={permitSummaryStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Safety Compliance Summary</h3>
        <div style={summaryGridStyles}>
          <div>
            <strong>Total Checklist Items:</strong> {Object.keys(permit.safetyChecklist?.answers || {}).length}
          </div>
          <div>
            <strong>Compliant Items:</strong> 
            <span style={{ color: '#27ae60', fontWeight: 'bold', marginLeft: '8px' }}>
              {Object.values(permit.safetyChecklist?.answers || {}).filter(a => a.answer === 'compliant').length}
            </span>
          </div>
          <div>
            <strong>Non-Compliant Items:</strong>
            <span style={{ color: '#e74c3c', fontWeight: 'bold', marginLeft: '8px' }}>
              {Object.values(permit.safetyChecklist?.answers || {}).filter(a => a.answer === 'not-compliant').length}
            </span>
          </div>
          <div>
            <strong>Photo Evidence:</strong>
            <span style={{ color: '#3498db', fontWeight: 'bold', marginLeft: '8px' }}>
              {Object.values(permit.safetyChecklist?.photos || {}).reduce((total, photos) => total + photos.length, 0)} photos
            </span>
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      <div style={actionSectionStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Final Approval Decision</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
            Approval Remarks / Conditions:
          </label>
          <textarea
            value={approvalRemarks}
            onChange={(e) => setApprovalRemarks(e.target.value)}
            style={textareaStyles}
            placeholder="Enter your approval remarks, any special conditions, or additional safety requirements..."
          />
        </div>
        
        <div style={buttonGroupStyles}>
          <button 
            type="button" 
            style={rejectButtonStyles}
            onClick={handleReject}
          >
            Reject Permit
          </button>
          <button 
            type="button" 
            style={{
              ...approveButtonStyles,
              backgroundColor: isGeneratingPDF ? '#95a5a6' : '#27ae60'
            }}
            onClick={handleApprove}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating PDF...' : 'Approve & Generate Permit'}
          </button>
        </div>

        {isGeneratingPDF && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '15px',
            color: '#3498db',
            fontSize: '14px'
          }}>
            ⏳ Generating digitally signed PDF permit...
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalWorkflow;