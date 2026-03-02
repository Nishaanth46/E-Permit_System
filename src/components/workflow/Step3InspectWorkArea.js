// In Step3InspectWorkArea.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermit } from '../../context/PermitContext';
import { FaCheck, FaTimes, FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Step3InspectWorkArea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { permitId } = useParams();
  const { permits, updatePermit } = usePermit();
  
  // Get actual permit data from context
  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (permitId) {
      const foundPermit = permits.find(p => p.id === parseInt(permitId));
      if (foundPermit) {
        setPermit(foundPermit);
      }
      setLoading(false);
    }
  }, [permitId, permits]);

  // Inspection form state
  const [inspection, setInspection] = useState({
    siteConditions: '',
    safetyCompliance: '',
    recommendations: '',
    finalRemarks: '',
    isCompliant: null
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInspection(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!permit || !permit.id) {
      toast.error('Error: Could not submit inspection. Missing permit ID.');
      return;
    }

    if (inspection.isCompliant === null) {
      toast.error('Please select an approval status (Recommend/Do Not Recommend)');
      return;
    }

    try {
      // Update the permit status based on compliance
      const newStatus = inspection.isCompliant ? 'pending_approval' : 'rejected';
      
      await updatePermit(permit.id, {
        ...permit,
        status: newStatus,
        inspection: {
          ...inspection,
          inspectedAt: new Date().toISOString(),
          inspector: user?.name || 'Unknown Inspector',
          isCompliant: inspection.isCompliant,
          status: 'completed'  // Mark inspection as completed
        },
        currentStep: inspection.isCompliant ? 4 : 0, // Go to approval step or back to start if rejected
        lastUpdated: new Date().toISOString()
      });

      // Show success message
      const message = inspection.isCompliant 
        ? 'Inspection completed! Forwarded for approval.' 
        : 'Inspection completed! Work not recommended for approval.';
      toast.success(message);
      
      // Navigate based on inspection result
      navigate(inspection.isCompliant ? '/workflow/step4' : '/dashboard');
    } catch (error) {
      console.error('Error submitting inspection:', error);
      toast.error('Failed to submit inspection. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading permit data...</div>;
  }

  // Show error if permit not found
  if (!permit) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Permit not found.</div>;
  }

  // Calculate compliance stats (sample data)
  const complianceStats = {
    total: 16,
    compliant: 12,
    nonCompliant: 4,
    complianceRate: 75
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Permit Summary Section */}
      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>Permit & Checklist Summary</h2>
        
        {/* Work Area Details */}
        <div style={gridContainer}>
          <div style={gridItem}>
            <label style={labelStyles}>Work Area</label>
            <div style={valueStyles}>{permit.workArea}</div>
          </div>
          <div style={gridItem}>
            <label style={labelStyles}>Location</label>
            <div style={valueStyles}>{permit.location}</div>
          </div>
          <div style={gridItem}>
            <label style={labelStyles}>Requester</label>
            <div style={valueStyles}>{permit.requester}</div>
          </div>
          <div style={gridItem}>
            <label style={labelStyles}>Safety Officer</label>
            <div style={valueStyles}>{permit.safetyOfficer}</div>
          </div>
        </div>

        {/* Safety Checklist Summary */}
        <h3 style={{ margin: '20px 0 10px' }}>Safety Checklist Summary</h3>
        <div style={statsContainer}>
          <div style={statCard}>
            <FaClipboardCheck style={{ ...statIcon, color: '#3498db' }} />
            <div style={statValue}>{complianceStats.total}</div>
            <div style={statLabel}>Total Items</div>
          </div>
          <div style={statCard}>
            <FaCheck style={{ ...statIcon, color: '#27ae60' }} />
            <div style={statValue}>{complianceStats.compliant}</div>
            <div style={statLabel}>Compliant</div>
          </div>
          <div style={statCard}>
            <FaTimes style={{ ...statIcon, color: '#e74c3c' }} />
            <div style={statValue}>{complianceStats.nonCompliant}</div>
            <div style={statLabel}>Non-Compliant</div>
          </div>
          <div style={statCard}>
            <div style={{ ...statValue, color: complianceStats.complianceRate >= 75 ? '#27ae60' : '#f39c12' }}>
              {complianceStats.complianceRate}%
            </div>
            <div style={statLabel}>Compliance Rate</div>
          </div>
        </div>
      </div>

      {/* Site Inspection Details Section */}
      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>Site Inspection Details</h2>
        
        {/* Site Conditions */}
        <div style={formGroup}>
          <label style={labelStyles}>Site Conditions</label>
          <textarea
            name="siteConditions"
            value={inspection.siteConditions}
            onChange={handleInputChange}
            style={textAreaStyle}
            placeholder="Describe current site conditions, housekeeping, and environmental factors..."
          />
        </div>

        {/* Safety Compliance */}
        <div style={formGroup}>
          <label style={labelStyles}>Safety Compliance Verification</label>
          <textarea
            name="safetyCompliance"
            value={inspection.safetyCompliance}
            onChange={handleInputChange}
            style={textAreaStyle}
            placeholder="Verify actual safety measures against checklist, note any discrepancies..."
          />
        </div>

        {/* Recommendations */}
        <div style={formGroup}>
          <label style={labelStyles}>Recommendations</label>
          <textarea
            name="recommendations"
            value={inspection.recommendations}
            onChange={handleInputChange}
            style={textAreaStyle}
            placeholder="Provide recommendations for improvement or additional safety measures..."
          />
        </div>
      </div>

      {/* Inspection Conclusion Section */}
      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>Inspection Conclusion</h2>
        
        <div style={formGroup}>
          <label style={labelStyles}>Final Inspection Remarks</label>
          <textarea
            name="finalRemarks"
            value={inspection.finalRemarks}
            onChange={handleInputChange}
            style={{ ...textAreaStyle, minHeight: '100px' }}
            placeholder="Provide overall inspection findings, risk assessment, and final recommendation..."
            required
          />
        </div>

        {/* Action Buttons */}
        <div style={buttonGroup}>
          <button
            type="button"
            onClick={() => setInspection(prev => ({ ...prev, isCompliant: false }))}
            style={{
              ...buttonStyle,
              backgroundColor: inspection.isCompliant === false ? '#e74c3c' : '#f5f5f5',
              color: inspection.isCompliant === false ? 'white' : '#333'
            }}
          >
            <FaTimes style={{ marginRight: '8px' }} /> Do Not Recommend
          </button>
          <button
            type="button"
            onClick={() => setInspection(prev => ({ ...prev, isCompliant: true }))}
            style={{
              ...buttonStyle,
              backgroundColor: inspection.isCompliant === true ? '#27ae60' : '#f5f5f5',
              color: inspection.isCompliant === true ? 'white' : '#333'
            }}
          >
            <FaCheck style={{ marginRight: '8px' }} /> Recommend for Approval
          </button>
        </div>

        {/* Inspector Info */}
        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '14px', color: '#7f8c8d' }}>
          <div>Inspector: <strong>{user?.name || 'Inspector Name'}</strong></div>
          <div>Date: {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleSubmit}
          style={{
            ...buttonStyle,
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px'
          }}
          disabled={inspection.isCompliant === null || !inspection.finalRemarks}
        >
          Submit Inspection
        </button>
      </div>
    </div>
  );
};

// Styles
const sectionStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '25px',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const sectionTitleStyles = {
  color: '#2c3e50',
  marginTop: 0,
  paddingBottom: '10px',
  borderBottom: '1px solid #eee',
  marginBottom: '20px'
};

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
};

const gridItem = {
  marginBottom: '15px'
};

const labelStyles = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#2c3e50'
};

const valueStyles = {
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '4px',
  border: '1px solid #e0e0e0'
};

const statsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '15px',
  marginTop: '20px'
};

const statCard = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
  textAlign: 'center'
};

const statIcon = {
  fontSize: '24px',
  marginBottom: '10px'
};

const statValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '5px 0'
};

const statLabel = {
  fontSize: '14px',
  color: '#7f8c8d'
};

const formGroup = {
  marginBottom: '20px'
};

const textAreaStyle = {
  width: '100%',
  minHeight: '80px',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  resize: 'vertical',
  fontFamily: 'inherit',
  fontSize: '14px'
};

const buttonGroup = {
  display: 'flex',
  gap: '15px',
  marginTop: '20px'
};

const buttonStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s'
};

export default Step3InspectWorkArea;