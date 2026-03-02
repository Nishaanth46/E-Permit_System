import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { WORK_AREAS } from '../../utils/constants';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '1000px',
  margin: '0 auto'
};

const headerStyles = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #3498db'
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

const workflowContainerStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const workflowCardStyles = {
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center'
};

const selectedWorkflowCardStyles = {
  ...workflowCardStyles,
  borderColor: '#3498db',
  backgroundColor: '#ebf5fb',
  transform: 'translateY(-2px)'
};

const cardIconStyles = {
  fontSize: '32px',
  marginBottom: '12px'
};

const cardTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '8px'
};

const cardDescriptionStyles = {
  fontSize: '12px',
  color: '#7f8c8d',
  lineHeight: '1.4'
};

const formSectionStyles = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const sectionTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
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

const buttonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const workflowTypes = [
  {
    id: 'hot-work',
    code: 'HOT_WORK',
    name: 'Hot Work Permit',
    icon: '🔥',
    description: 'Welding, cutting, grinding, and other spark-producing activities',
    riskLevel: 'High'
  },
  {
    id: 'confined-space',
    code: 'CONFINED_SPACE',
    name: 'Confined Space Entry',
    icon: '🚪',
    description: 'Entry into tanks, vessels, silos, and other confined spaces',
    riskLevel: 'High'
  },
  {
    id: 'electrical',
    code: 'ELECTRICAL',
    name: 'Electrical Work',
    icon: '⚡',
    description: 'Electrical maintenance, testing, and high-voltage work',
    riskLevel: 'High'
  },
  {
    id: 'height-work',
    code: 'HEIGHT_WORK',
    name: 'Work at Height',
    icon: '🪜',
    description: 'Scaffolding, elevated platforms, and roof work',
    riskLevel: 'High'
  },
  {
    id: 'excavation',
    code: 'EXCAVATION',
    name: 'Excavation Work',
    icon: '⛏️',
    description: 'Trenching, digging, and underground work',
    riskLevel: 'Medium'
  },
  {
    id: 'general',
    code: 'GENERAL',
    name: 'General Permit',
    icon: '📝',
    description: 'Other hazardous activities requiring safety oversight',
    riskLevel: 'Medium'
  }
];

const Step1RequestPermit = ({ onComplete }) => {
  const { user } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [formData, setFormData] = useState({
    workType: '',
    location: '',
    workDescription: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    safetyMeasures: '',
    equipmentUsed: '',
    emergencyContacts: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkflowSelect = (workflowCode) => {
    setSelectedWorkflow(workflowCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedWorkflow) {
      toast.error('Please select a permit workflow type');
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

    const permitRequest = {
      ...formData,
      workflowType: selectedWorkflow,
      workflowName: workflowTypes.find(wf => wf.code === selectedWorkflow)?.name,
      requester: user.name,
      requesterId: user.id,
      department: user.department,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      currentStep: 2
    };

    onComplete(permitRequest);
    toast.success('Permit request submitted successfully!');
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#3498db', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
          New Permit - Select Workflow
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Choose the appropriate permit workflow for your high-risk work activity
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Workflow Selection */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>📊 Select Permit Workflow</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' }}>
            Choose the type of permit that matches your work activity. Each workflow has specific safety requirements and approval steps.
          </p>
          
          <div style={workflowContainerStyles}>
            {workflowTypes.map(workflow => (
              <div
                key={workflow.id}
                style={selectedWorkflow === workflow.code ? selectedWorkflowCardStyles : workflowCardStyles}
                onClick={() => handleWorkflowSelect(workflow.code)}
              >
                <div style={cardIconStyles}>{workflow.icon}</div>
                <div style={cardTitleStyles}>{workflow.name}</div>
                <div style={cardDescriptionStyles}>
                  {workflow.description}
                </div>
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '11px', 
                  color: workflow.riskLevel === 'High' ? '#e74c3c' : '#f39c12',
                  fontWeight: 'bold'
                }}>
                  {workflow.riskLevel} Risk
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Details */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>📋 Work Details</h3>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Specific Work Type *</label>
            <input
              type="text"
              name="workType"
              value={formData.workType}
              onChange={handleInputChange}
              style={inputStyles}
              placeholder="e.g., Welding, Electrical testing, Tank entry"
              required
            />
          </div>

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
              placeholder="Detailed description of work to be performed, methods, procedures, and scope..."
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

        {/* Team & Safety Information */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>👥 Team & Safety Information</h3>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Team Members Involved</label>
            <textarea
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleInputChange}
              style={textareaStyles}
              placeholder="List all team members with their roles, responsibilities, and training certifications..."
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Safety Measures Planned</label>
            <textarea
              name="safetyMeasures"
              value={formData.safetyMeasures}
              onChange={handleInputChange}
              style={textareaStyles}
              placeholder="Describe planned safety measures, PPE requirements, isolation procedures, emergency protocols..."
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
              placeholder="List all equipment, tools, machinery, and hazardous materials"
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Emergency Contacts</label>
            <input
              type="text"
              name="emergencyContacts"
              value={formData.emergencyContacts}
              onChange={handleInputChange}
              style={inputStyles}
              placeholder="Site supervisor, safety officer, emergency services contacts"
            />
          </div>
        </div>

        {/* Submit Section */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button type="submit" style={buttonStyles}>
            📨 Submit Permit Request
          </button>
          <p style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '10px' }}>
            This will send the request to Safety Officer for checklist verification
          </p>
        </div>
      </form>
    </div>
  );
};

export default Step1RequestPermit;
