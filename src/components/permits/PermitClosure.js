import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '800px',
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

const completionSectionStyles = {
  backgroundColor: '#f0f9f0',
  padding: '25px',
  borderRadius: '8px',
  border: '2px solid #27ae60',
  marginBottom: '25px'
};

const checklistStyles = {
  marginBottom: '25px'
};

const checklistItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: 'white',
  borderRadius: '6px',
  border: '1px solid #e9ecef'
};

const photoUploadSectionStyles = {
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #3498db'
};

const uploadAreaStyles = {
  border: '2px dashed #bdc3c7',
  borderRadius: '8px',
  padding: '30px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s ease',
  marginBottom: '15px'
};

const uploadAreaHoverStyles = {
  borderColor: '#3498db',
  backgroundColor: '#f8f9fa'
};

const photoPreviewStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '10px',
  marginTop: '15px'
};

const previewImageStyles = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '6px',
  border: '2px solid #bdc3c7'
};

const closureRemarksStyles = {
  marginBottom: '25px'
};

const textareaStyles = {
  width: '100%',
  padding: '12px',
  border: '1px solid #dcdfe6',
  borderRadius: '6px',
  fontSize: '14px',
  minHeight: '120px',
  resize: 'vertical'
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
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const PermitClosure = ({ permit, onClosureSubmit, onCancel }) => {
  const { user } = useAuth();
  const [closureData, setClosureData] = useState({
    completionChecklist: {
      workCompleted: false,
      areaCleaned: false,
      equipmentStored: false,
      safetyRestored: false,
      teamAccounted: false
    },
    closurePhotos: [],
    closureRemarks: '',
    closedBy: user.name
  });
  const [isDragging, setIsDragging] = useState(false);

  const completionChecklist = [
    {
      id: 'workCompleted',
      label: 'All planned work has been completed as per scope',
      description: 'Verify that all tasks in the work description are finished'
    },
    {
      id: 'areaCleaned',
      label: 'Work area has been thoroughly cleaned and restored',
      description: 'Remove all debris, tools, and temporary installations'
    },
    {
      id: 'equipmentStored',
      label: 'All equipment and tools have been properly stored',
      description: 'Return equipment to designated storage areas'
    },
    {
      id: 'safetyRestored',
      label: 'All safety systems and barriers have been restored',
      description: 'Reinstall guards, safety devices, and warning signs'
    },
    {
      id: 'teamAccounted',
      label: 'All team members have been accounted for and are safe',
      description: 'Confirm all personnel have left the work area safely'
    }
  ];

  const handleChecklistChange = (itemId, checked) => {
    setClosureData(prev => ({
      ...prev,
      completionChecklist: {
        ...prev.completionChecklist,
        [itemId]: checked
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    const newPhotos = imageFiles.map(file => {
      const url = URL.createObjectURL(file);
      return {
        url,
        filename: file.name,
        type: 'completion_evidence',
        uploadedAt: new Date().toISOString()
      };
    });

    setClosureData(prev => ({
      ...prev,
      closurePhotos: [...prev.closurePhotos, ...newPhotos]
    }));

    toast.success(`Added ${imageFiles.length} photo(s)`);
  };

  const removePhoto = (index) => {
    setClosureData(prev => ({
      ...prev,
      closurePhotos: prev.closurePhotos.filter((_, i) => i !== index)
    }));
  };

  const handleRemarksChange = (e) => {
    setClosureData(prev => ({
      ...prev,
      closureRemarks: e.target.value
    }));
  };

  const handleSubmit = () => {
    // Validate checklist
    const allChecked = Object.values(closureData.completionChecklist).every(checked => checked);
    if (!allChecked) {
      toast.error('Please complete all closure checklist items');
      return;
    }

    if (closureData.closurePhotos.length === 0) {
      toast.error('Please upload at least one photo as completion evidence');
      return;
    }

    if (!closureData.closureRemarks.trim()) {
      toast.error('Please provide closure remarks');
      return;
    }

    onClosureSubmit({
      ...closureData,
      closedAt: new Date().toISOString()
    });
  };

  const allChecklistCompleted = Object.values(closureData.completionChecklist).every(checked => checked);

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>✅ Permit Closure Request</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Work Completion Verification and Area Handover
        </p>
      </div>

      {/* Completion Checklist */}
      <div style={completionSectionStyles}>
        <h3 style={{ color: '#27ae60', marginBottom: '20px' }}>Completion Verification Checklist</h3>
        <p style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '14px' }}>
          Confirm that all work has been completed and the area has been restored to safe condition.
        </p>

        <div style={checklistStyles}>
          {completionChecklist.map(item => (
            <div key={item.id} style={checklistItemStyles}>
              <input
                type="checkbox"
                id={item.id}
                checked={closureData.completionChecklist[item.id]}
                onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                style={{ marginTop: '2px' }}
              />
              <div>
                <label 
                  htmlFor={item.id}
                  style={{ 
                    fontWeight: '600', 
                    color: '#2c3e50',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </label>
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {allChecklistCompleted && (
          <div style={{
            backgroundColor: '#d5f4e6',
            padding: '15px',
            borderRadius: '6px',
            textAlign: 'center',
            border: '1px solid #27ae60'
          }}>
            <span style={{ color: '#27ae60', fontWeight: '600' }}>
              ✅ All completion criteria verified and satisfied
            </span>
          </div>
        )}
      </div>

      {/* Photo Evidence */}
      <div style={photoUploadSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📷 Completion Photo Evidence</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '14px' }}>
          Upload photos showing completed work, cleaned area, and restored safety conditions
        </p>

        <div
          style={{
            ...uploadAreaStyles,
            ...(isDragging ? uploadAreaHoverStyles : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('closure-photos').click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
          <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
            Upload Completion Photos
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Drag & drop photos here or click to browse
          </div>
          <input
            type="file"
            id="closure-photos"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {closureData.closurePhotos.length > 0 && (
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
              Uploaded Photos ({closureData.closurePhotos.length})
            </div>
            <div style={photoPreviewStyles}>
              {closureData.closurePhotos.map((photo, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img 
                    src={photo.url} 
                    alt={`Completion evidence ${index + 1}`}
                    style={previewImageStyles}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Closure Remarks */}
      <div style={closureRemarksStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📝 Closure Remarks</h3>
        <textarea
          value={closureData.closureRemarks}
          onChange={handleRemarksChange}
          style={textareaStyles}
          placeholder="Provide details about work completion, any issues encountered, and final observations..."
        />
      </div>

      {/* Action Buttons */}
      <div style={buttonGroupStyles}>
        <button 
          type="button" 
          style={secondaryButtonStyles}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="button" 
          style={{
            ...primaryButtonStyles,
            backgroundColor: allChecklistCompleted ? '#27ae60' : '#95a5a6'
          }}
          onClick={handleSubmit}
          disabled={!allChecklistCompleted}
        >
          Submit Closure Request
        </button>
      </div>
    </div>
  );
};

export default PermitClosure;