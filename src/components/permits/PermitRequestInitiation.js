import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermit } from '../../context/PermitContext';
import { WORK_AREAS } from '../../utils/constants';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '800px',
  margin: '0 auto'
};

const sectionStyles = {
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

const subtitleStyles = {
  fontSize: '16px',
  color: '#7f8c8d',
  marginBottom: '25px'
};

const formGroupStyles = {
  marginBottom: '20px'
};

const labelStyles = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#2c3e50',
  fontSize: '14px'
};

const inputStyles = {
  width: '100%',
  padding: '12px',
  border: '1px solid #dcdfe6',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s ease'
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

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px'
};

const workAreaGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  marginBottom: '20px'
};

const workAreaCardStyles = {
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  padding: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center'
};

const selectedWorkAreaCardStyles = {
  ...workAreaCardStyles,
  borderColor: '#3498db',
  backgroundColor: '#ebf5fb',
  transform: 'translateY(-2px)'
};

const workAreaIconStyles = {
  fontSize: '32px',
  marginBottom: '10px'
};

const workAreaNameStyles = {
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '5px'
};

const workAreaDescStyles = {
  fontSize: '12px',
  color: '#7f8c8d'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'flex-end',
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #e9ecef'
};

const primaryButtonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'background-color 0.3s ease'
};

const secondaryButtonStyles = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const PermitRequestInitiation = ({ onNext, onCancel }) => {
  const { user } = useAuth();
  const { workAreas } = usePermit();
  
  const [formData, setFormData] = useState({
    workArea: '',
    workType: '',
    location: '',
    workDescription: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    safetyMeasures: '',
    equipmentUsed: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
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
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    onNext(formData);
  };

  return (
    <div style={containerStyles}>
      <div style={sectionStyles}>
        <h2 style={titleStyles}>🛡️ Permit Request Initiation</h2>
        <p style={subtitleStyles}>
          Employee/Contractor: <strong>{user?.name}</strong> | Department: {user?.department}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Work Area Selection */}
        <div style={sectionStyles}>
          <h3 style={labelStyles}>1. Select Work Area & Type</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>
            Choose from critical work areas requiring safety permits
          </p>
          
          <div style={workAreaGridStyles}>
            {workAreas.map(area => (
              <div
                key={area.id}
                style={formData.workArea === area.code ? selectedWorkAreaCardStyles : workAreaCardStyles}
                onClick={() => handleWorkAreaSelect(area.code)}
              >
                <div style={workAreaIconStyles}>{area.icon || '🛠️'}</div>
                <div style={workAreaNameStyles}>{area.name}</div>
                <div style={workAreaDescStyles}>{area.description}</div>
              </div>
            ))}
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Specific Work Type</label>
            <input
              type="text"
              name="workType"
              value={formData.workType}
              onChange={handleInputChange}
              style={inputStyles}
              placeholder="e.g., Welding, Circuit testing, Tank cleaning"
              required
            />
          </div>
        </div>

        {/* Work Details */}
        <div style={sectionStyles}>
          <h3 style={labelStyles}>2. Work Details</h3>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Work Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              style={inputStyles}
              placeholder="Building, Floor, Area, Specific location"
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Work Description *</label>
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleInputChange}
              style={textareaStyles}
              placeholder="Detailed description of work to be performed, methods, and procedures..."
              required
            />
          </div>

          <div style={gridStyles}>
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
        </div>

        {/* Team & Safety */}
        <div style={sectionStyles}>
          <h3 style={labelStyles}>3. Team & Safety Information</h3>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Team Members Involved</label>
            <textarea
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleInputChange}
              style={textareaStyles}
              placeholder="List all team members with their roles and responsibilities..."
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Safety Measures Planned</label>
            <textarea
              name="safetyMeasures"
              value={formData.safetyMeasures}
              onChange={handleInputChange}
              style={textareaStyles}
              placeholder="Describe planned safety measures, PPE, emergency procedures..."
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Equipment to be Used</label>
            <input
              type="text"
              name="equipmentUsed"
              value={formData.equipmentUsed}
              onChange={handleInputChange}
              style={inputStyles}
              placeholder="List all equipment, tools, and machinery"
            />
          </div>
        </div>

        <div style={buttonGroupStyles}>
          <button type="button" style={secondaryButtonStyles} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" style={primaryButtonStyles}>
            Continue to Safety Checklist →
          </button>
        </div>
      </form>
    </div>
  );
};

export default PermitRequestInitiation;