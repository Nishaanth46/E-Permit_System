import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pdfService } from '../../services/pdfService';
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
  borderBottom: '2px solid #9b59b6'
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const summarySectionStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '25px',
  marginBottom: '30px'
};

const summaryCardStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const workflowProgressStyles = {
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #3498db'
};

const actionSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
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

const primaryButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const secondaryButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const Step4ApprovePermit = ({ permit, onApprove, onReject }) => {
  const { user } = useAuth();
  const [approvalData, setApprovalData] = useState({
    approver: user.name,
    approvalTime: '',
    conditions: '',
    remarks: '',
    digitalSignature: `approved_by_${user.name.replace(/\s+/g, '_').toLowerCase()}`
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApprovalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApprove = async () => {
    if (!approvalData.remarks.trim()) {
      toast.error('Please provide approval remarks');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Generate PDF Permit
      const pdfData = await pdfService.generatePermitPDF({
        ...permit,
        approval: approvalData
      });

      const approvalResult = {
        ...approvalData,
        approvalTime: new Date().toISOString(),
        status: 'approved',
        pdfUrl: pdfData.url,
        permitNumber: `PER-${Date.now()}`
      };

      onApprove(approvalResult);
      toast.success('Permit approved and PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF permit');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleReject = () => {
    if (!approvalData.remarks.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    const rejectionResult = {
      ...approvalData,
      approvalTime: new Date().toISOString(),
      status: 'rejected'
    };

    onReject(rejectionResult);
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#9b59b6', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>4</span>
          Approve Permit - Approver
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Final approval and digital signing of safety permit
        </p>
      </div>

      {/* Workflow Progress */}
      <div style={workflowProgressStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Workflow Progress</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Step 1</div>
            <div style={{ fontWeight: '600', color: '#27ae60' }}>✅ Request</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Step 2</div>
            <div style={{ fontWeight: '600', color: '#27ae60' }}>✅ Checklist</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Step 3</div>
            <div style={{ fontWeight: '600', color: '#27ae60' }}>✅ Inspection</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Step 4</div>
            <div style={{ fontWeight: '600', color: '#9b59b6' }}>🔄 Approval</div>
          </div>
        </div>
      </div>

      {/* Summary Sections */}
      <div style={summarySectionStyles}>
        {/* Permit Details */}
        <div style={summaryCardStyles}>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Permit Details</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Work Area:</strong> {permit.workArea}</div>
            <div><strong>Location:</strong> {permit.location}</div>
            <div><strong>Requester:</strong> {permit.requester}</div>
            <div><strong>Work Period:</strong> {new Date(permit.startDate).toLocaleString()} to {new Date(permit.endDate).toLocaleString()}</div>
            <div><strong>Team Size:</strong> {permit.teamMembers?.split('\n').length || 1} members</div>
          </div>
        </div>

        {/* Safety Compliance */}
        <div style={summaryCardStyles}>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Safety Compliance</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Checklist Verified By:</strong> {permit.safetyChecklist?.verifiedBy}</div>
            <div><strong>Inspection By:</strong> {permit.inspection?.inspector}</div>
            <div><strong>Compliance Rate:</strong> 
              <span style={{ color: '#27ae60', fontWeight: 'bold', marginLeft: '5px' }}>
                {Math.round((Object.values(permit.safetyChecklist?.answers || {}).filter(a => a.answer === 'compliant').length / Object.keys(permit.safetyChecklist?.answers || {}).length) * 100)}%
              </span>
            </div>
            <div><strong>Recommendation:</strong> 
              <span style={{ color: '#27ae60', fontWeight: 'bold', marginLeft: '5px' }}>
                ✅ APPROVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Remarks */}
      {permit.inspection && (
        <div style={{ ...summaryCardStyles, marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Inspection Report</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Inspector Remarks:</strong>
              <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: '#555' }}>
                "{permit.inspection.remarks}"
              </p>
            </div>
            <div>
              <strong>Site Conditions:</strong>
              <p style={{ margin: '8px 0 0 0', color: '#555' }}>
                {permit.inspection.siteConditions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Approval Action */}
      <div style={actionSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Final Approval Decision</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
            Approval Conditions & Remarks *
          </label>
          <textarea
            name="conditions"
            value={approvalData.conditions}
            onChange={handleInputChange}
            style={{ ...textareaStyles, minHeight: '80px', marginBottom: '15px' }}
            placeholder="Specify any special conditions, restrictions, or additional safety requirements..."
          />
          
          <textarea
            name="remarks"
            value={approvalData.remarks}
            onChange={handleInputChange}
            style={textareaStyles}
            placeholder="Provide final approval remarks and authorization details..."
            required
          />
        </div>

        <div style={{ ...buttonGroupStyles, flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="button" 
              style={secondaryButtonStyles}
              onClick={handleReject}
            >
              ❌ Reject Permit
            </button>
            <button 
              type="button" 
              style={{
                ...primaryButtonStyles,
                backgroundColor: isGeneratingPDF ? '#95a5a6' : '#27ae60'
              }}
              onClick={handleApprove}
              disabled={isGeneratingPDF || !approvalData.remarks.trim()}
            >
              {isGeneratingPDF ? '⏳ Generating PDF...' : '✅ Approve & Sign Permit'}
            </button>
          </div>
          
          {isGeneratingPDF && (
            <div style={{ fontSize: '12px', color: '#3498db' }}>
              Generating digitally signed PDF permit with QR code...
            </div>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '15px', textAlign: 'center' }}>
          Approving Authority: <strong>{user.name}</strong> | 
          Digital Signature: <strong>{approvalData.digitalSignature}</strong>
        </div>
      </div>
    </div>
  );
};

export default Step4ApprovePermit;