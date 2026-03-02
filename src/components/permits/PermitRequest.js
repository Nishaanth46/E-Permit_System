import React, { useState } from 'react';
import { usePermit } from '../../context/PermitContext';
import { useAuth } from '../../context/AuthContext';
import SafetyChecklist from './SafetyChecklist';
import { WORK_AREAS } from '../../utils/constants';
import { toast } from 'react-toastify';

const formStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const sectionStyles = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid #ecf0f1'
};

const sectionTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '20px'
};

const formGroupStyles = {
  marginBottom: '20px'
};

const labelStyles = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#2c3e50'
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  border: '1px solid #bdc3c7',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const selectStyles = {
  ...inputStyles,
  backgroundColor: 'white'
};

const textareaStyles = {
  ...inputStyles,
  minHeight: '100px',
  resize: 'vertical'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '30px'
};

const submitButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
};

const cancelButtonStyles = {
  backgroundColor: '#95a5a6',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const workAreaCardStyles = {
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const selectedWorkAreaCardStyles = {
  ...workAreaCardStyles,
  borderColor: '#3498db',
  backgroundColor: '#ebf5fb'
};

const riskBadgeStyles = (riskLevel) => {
  const colors = {
    High: '#e74c3c',
    Medium: '#f39c12',
    Low: '#27ae60'
  };
  
  return {
    backgroundColor: colors[riskLevel],
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '10px'
  };
};

const PermitRequest = ({ onCancel, onSubmit }) => {
  const { workAreas, createPermit } = usePermit();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workArea: '',
    workDescription: '',
    location: '',
    startDate: '',
    endDate: '',
    workersInvolved: 1,
    equipment: '',
    emergencyProcedures: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [safetyChecklist, setSafetyChecklist] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkAreaSelect = (areaCode) => {
    setFormData(prev => ({
      ...prev,
      workArea: areaCode
    }));
  };

  const handleNext = () => {
    if (!formData.workArea) {
      toast.error('Please select a work area');
      return;
    }
    if (!formData.workDescription) {
      toast.error('Please provide work description');
      return;
    }
    if (!formData.location) {
      toast.error('Please specify work location');
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      // Validate safety checklist
      const selectedArea = workAreas.find(area => area.code === formData.workArea);
      const areaChecklist = require('../../utils/constants').SAFETY_CHECKLISTS[formData.workArea] || [];
      const requiredQuestions = areaChecklist.filter(q => q.required);
      
      const answeredQuestions = Object.keys(safetyChecklist.answers || {}).length;
      if (requiredQuestions.length > 0 && answeredQuestions < requiredQuestions.length) {
        toast.error(`Please complete all required safety checklist questions for ${selectedArea.name}`);
        return;
      }

      const permitData = {
        ...formData,
        safetyChecklist,
        requesterId: user.id,
        requesterName: user.name,
        department: user.department
      };
      
      const newPermit = createPermit(permitData);
      toast.success('Permit request submitted successfully!');
      onSubmit?.(newPermit);
    } catch (error) {
      toast.error('Failed to submit permit request');
    }
  };

  const getSelectedWorkArea = () => {
    return workAreas.find(area => area.code === formData.workArea);
  };

  return (
    <div style={formStyles}>
      {currentStep === 1 && (
        <>
          <div style={sectionStyles}>
            <h2 style={sectionTitleStyles}>1. Select Work Area</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
              Choose from 7 critical work areas requiring safety permits
            </p>
            
            {workAreas.map(area => (
              <div
                key={area.id}
                style={formData.workArea === area.code ? selectedWorkAreaCardStyles : workAreaCardStyles}
                onClick={() => handleWorkAreaSelect(area.code)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{area.name}</h4>
                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
                      {area.description}
                    </p>
                  </div>
                  <span style={riskBadgeStyles(area.riskLevel)}>
                    {area.riskLevel} RISK
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={sectionStyles}>
            <h2 style={sectionTitleStyles}>2. Work Details</h2>
            
            <div style={formGroupStyles}>
              <label style={labelStyles}>Work Description *</label>
              <textarea
                name="workDescription"
                value={formData.workDescription}
                onChange={handleInputChange}
                style={textareaStyles}
                placeholder="Describe the work to be performed, including specific tasks and methods..."
                required
              />
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={inputStyles}
                placeholder="Specific location within facility (building, floor, area)"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={formGroupStyles}>
                <label style={labelStyles}>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  style={inputStyles}
                  required
                />
              </div>

              <div style={formGroupStyles}>
                <label style={labelStyles}>End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  style={inputStyles}
                  required
                />
              </div>
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles}>Number of Workers</label>
              <input
                type="number"
                name="workersInvolved"
                value={formData.workersInvolved}
                onChange={handleInputChange}
                style={inputStyles}
                min="1"
                max="50"
              />
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles}>Equipment to be Used</label>
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                style={inputStyles}
                placeholder="List equipment, tools, and machinery"
              />
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles}>Emergency Procedures</label>
              <textarea
                name="emergencyProcedures"
                value={formData.emergencyProcedures}
                onChange={handleInputChange}
                style={textareaStyles}
                placeholder="Describe emergency procedures and contact information"
              />
            </div>
          </div>

          <div style={buttonGroupStyles}>
            <button type="button" style={cancelButtonStyles} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" style={submitButtonStyles} onClick={handleNext}>
              Next: Safety Checklist
            </button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div style={sectionStyles}>
            <h2 style={sectionTitleStyles}>
              Safety Checklist for {getSelectedWorkArea()?.name}
            </h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
              Complete all required safety verification questions. Photo evidence may be required.
            </p>
          </div>

          <SafetyChecklist 
            workArea={formData.workArea}
            onChecklistChange={setSafetyChecklist}
          />
          
          <div style={buttonGroupStyles}>
            <button type="button" style={cancelButtonStyles} onClick={handleBack}>
              Back to Details
            </button>
            <button type="button" style={submitButtonStyles} onClick={handleSubmit}>
              Submit Permit Request
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PermitRequest;