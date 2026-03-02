import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermit } from '../../context/PermitContext';
import { WORK_AREAS } from '../../utils/constants';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

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

const workAreaGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
  gap: '8px',
  margin: '5px'
};

const pdfViewerStyles = {
  width: '100%',
  height: '600px',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  marginTop: '20px'
};

const tabContainerStyles = {
  display: 'flex',
  marginBottom: '20px',
  borderBottom: '1px solid #e9ecef'
};

const tabStyles = {
  padding: '12px 24px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: '600',
  color: '#7f8c8d',
  borderBottom: '2px solid transparent'
};

const activeTabStyles = {
  ...tabStyles,
  color: '#3498db',
  borderBottom: '2px solid #3498db'
};

const completedPermitsListStyles = {
  maxHeight: '400px',
  overflowY: 'auto',
  border: '1px solid #e9ecef',
  borderRadius: '8px'
};

const permitItemStyles = {
  padding: '15px',
  borderBottom: '1px solid #e9ecef',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

const selectedPermitItemStyles = {
  ...permitItemStyles,
  backgroundColor: '#ebf5fb',
  borderLeft: '4px solid #3498db'
};

const statusBadgeStyles = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  display: 'inline-block',
  marginLeft: '10px'
};

const statusColors = {
  closed: { backgroundColor: '#d5f4e6', color: '#155724' },
  approved: { backgroundColor: '#d5f4e6', color: '#155724' },
  rejected: { backgroundColor: '#f8d7da', color: '#721c24' },
  pending_closure: { backgroundColor: '#fff3cd', color: '#856404' },
  pending_approval: { backgroundColor: '#fff3cd', color: '#856404' },
  pending_inspection: { backgroundColor: '#fff3cd', color: '#856404' },
  pending_checklist: { backgroundColor: '#fff3cd', color: '#856404' }
};

const Step1RequestPermit = ({ onComplete }) => {
  const { user } = useAuth();
  const { permits } = usePermit();
  const [activeTab, setActiveTab] = useState('new');
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [formData, setFormData] = useState({
    workArea: '',
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

  // Filter user's completed permits (closed or approved)
  const userCompletedPermits = permits.filter(permit => 
    permit.requesterId === user.id && (permit.status === 'closed' || permit.status === 'approved')
  );

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

    const permitRequest = {
      ...formData,
      requester: user.name,
      requesterId: user.id,
      department: user.department,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      currentStep: 2,
      permitNumber: `PER-${Date.now()}`
    };

    onComplete(permitRequest);
    toast.success('Permit created successfully!');
    
    // Reset form
    setFormData({
      workArea: '',
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
  };

  const generatePDF = (permit) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('SAFETY PERMIT', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Work Permit System', 105, 22, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    
    // Permit Details
    doc.setFontSize(16);
    doc.text('PERMIT DETAILS', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Permit Number: ${permit.permitNumber || `PER-${permit.id}`}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Status: ${permit.status.replace('_', ' ').toUpperCase()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Submitted: ${new Date(permit.submittedAt).toLocaleDateString()}`, 14, yPosition);
    yPosition += 10;
    
    // Work Information
    doc.setFontSize(14);
    doc.text('WORK INFORMATION', 14, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text(`Work Area: ${permit.workArea}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Work Type: ${permit.workType}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Location: ${permit.location}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Start: ${new Date(permit.startDate).toLocaleString()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`End: ${new Date(permit.endDate).toLocaleString()}`, 14, yPosition);
    yPosition += 8;
    
    // Work Description
    const workDescLines = doc.splitTextToSize(`Description: ${permit.workDescription}`, 180);
    doc.text(workDescLines, 14, yPosition);
    yPosition += workDescLines.length * 5 + 8;
    
    // Safety Information
    if (permit.safetyMeasures) {
      doc.setFontSize(14);
      doc.text('SAFETY MEASURES', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const safetyLines = doc.splitTextToSize(permit.safetyMeasures, 180);
      doc.text(safetyLines, 14, yPosition);
      yPosition += safetyLines.length * 5 + 8;
    }
    
    // Team Information
    if (permit.teamMembers) {
      doc.setFontSize(14);
      doc.text('TEAM MEMBERS', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const teamLines = doc.splitTextToSize(permit.teamMembers, 180);
      doc.text(teamLines, 14, yPosition);
      yPosition += teamLines.length * 5 + 8;
    }
    
    // Equipment
    if (permit.equipmentUsed) {
      doc.setFontSize(14);
      doc.text('EQUIPMENT USED', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const equipmentLines = doc.splitTextToSize(permit.equipmentUsed, 180);
      doc.text(equipmentLines, 14, yPosition);
      yPosition += equipmentLines.length * 5 + 8;
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);
    doc.text(`Requester: ${permit.requester}`, 14, 285);
    
    // Generate PDF URL
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  };

  const handlePermitSelect = (permit) => {
    setSelectedPermit(permit);
    generatePDF(permit);
  };

  const downloadPDF = () => {
    if (pdfUrl && selectedPermit) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${selectedPermit.permitNumber || `permit-${selectedPermit.id}`}.pdf`;
      link.click();
    }
  };

  useEffect(() => {
    // Clean up URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#3498db', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
          New Permit - Requester
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Create a new safety permit for high-risk work activities
        </p>
      </div>

      {/* Tabs */}
      <div style={tabContainerStyles}>
        <button 
          style={activeTab === 'new' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('new')}
        >
          Create New Permit
        </button>
        <button 
          style={activeTab === 'completed' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('completed')}
        >
          Completed Permits ({userCompletedPermits.length})
        </button>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleSubmit}>
          {/* Work Area Selection */}
          <div style={formSectionStyles}>
            <h3 style={sectionTitleStyles}>📍 Work Area & Type</h3>
            
            <div style={workAreaGridStyles}>
              {WORK_AREAS.map(area => (
                <div
                  key={area.id}
                  style={formData.workArea === area.code ? selectedWorkAreaCardStyles : workAreaCardStyles}
                  onClick={() => handleWorkAreaSelect(area.code)}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{area.icon || '🛠️'}</div>
                  <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    {area.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#7f8c8d' }}>
                    {area.riskLevel} Risk
                  </div>
                </div>
              ))}
            </div>

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
          </div>

          {/* Work Details */}
          <div style={formSectionStyles}>
            <h3 style={sectionTitleStyles}>📋 Work Details</h3>
            
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
              📨 Create New Permit
            </button>
            <p style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '10px' }}>
              This will send the permit to Safety Officer for checklist verification
            </p>
          </div>
        </form>
      ) : (
        <div>
          {userCompletedPermits.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
              {/* Permit List */}
              <div>
                <h3 style={sectionTitleStyles}>Completed Permits</h3>
                <div style={completedPermitsListStyles}>
                  {userCompletedPermits.map(permit => (
                    <div
                      key={permit.id}
                      style={selectedPermit?.id === permit.id ? selectedPermitItemStyles : permitItemStyles}
                      onClick={() => handlePermitSelect(permit)}
                    >
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {permit.permitNumber || `PER-${permit.id}`}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
                        {permit.workArea} • {permit.location}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7f8c8d', marginTop: '5px' }}>
                        {new Date(permit.submittedAt).toLocaleDateString()}
                      </div>
                      <span style={{
                        ...statusBadgeStyles,
                        ...statusColors[permit.status]
                      }}>
                        {permit.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Viewer */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={sectionTitleStyles}>
                    Permit Document
                    {selectedPermit && ` - ${selectedPermit.permitNumber || `PER-${selectedPermit.id}`}`}
                  </h3>
                  {pdfUrl && (
                    <button style={buttonStyles} onClick={downloadPDF}>
                      📥 Download PDF
                    </button>
                  )}
                </div>
                
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    style={pdfViewerStyles}
                    title="Permit PDF"
                  />
                ) : (
                  <div style={{
                    ...pdfViewerStyles,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    color: '#7f8c8d'
                  }}>
                    Select a permit to view the PDF document
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
              <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>No Completed Permits</h3>
              <p style={{ color: '#7f8c8d' }}>
                Your completed permits will appear here once they are approved or closed.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step1RequestPermit;