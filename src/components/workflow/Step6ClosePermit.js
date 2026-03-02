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
  borderBottom: '2px solid #27ae60'
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

const Step6ClosePermit = ({ permit, onClosureComplete }) => {
  const { user } = useAuth();
  const [closureData, setClosureData] = useState({
    completionChecklist: {
      workCompleted: false,
      areaCleaned: false,
      equipmentStored: false,
      safetyRestored: false,
      teamAccounted: false,
      permitsReturned: false
    },
    closurePhotos: [],
    closureRemarks: '',
    closedBy: user.name,
    closureTime: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  const completionChecklist = [
    {
      id: 'workCompleted',
      label: 'All planned work has been completed as per scope',
      description: 'Verify that all tasks in the work description are finished satisfactorily'
    },
    {
      id: 'areaCleaned',
      label: 'Work area has been thoroughly cleaned and restored',
      description: 'Remove all debris, tools, materials, and temporary installations'
    },
    {
      id: 'equipmentStored',
      label: 'All equipment and tools have been properly stored',
      description: 'Return equipment to designated storage areas in good condition'
    },
    {
      id: 'safetyRestored',
      label: 'All safety systems and barriers have been restored',
      description: 'Reinstall guards, safety devices, warning signs, and isolation points'
    },
    {
      id: 'teamAccounted',
      label: 'All team members have been accounted for and are safe',
      description: 'Confirm all personnel have left the work area safely and are accounted for'
    },
    {
      id: 'permitsReturned',
      label: 'All permits and documentation have been returned',
      description: 'Collect and return signed permits to safety office'
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
        type: 'closure_evidence',
        uploadedAt: new Date().toISOString()
      };
    });

    setClosureData(prev => ({
      ...prev,
      closurePhotos: [...prev.closurePhotos, ...newPhotos]
    }));

    toast.success(`Added ${imageFiles.length} photo(s) as closure evidence`);
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

  const handleClosure = () => {
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

    const closureResult = {
      ...closureData,
      closureTime: new Date().toISOString(),
      status: 'closed',
      permitNumber: permit.permitNumber,
      workArea: permit.workArea,
      location: permit.location
    };

    onClosureComplete(closureResult);
    toast.success('Permit closed successfully!');
  };

  const allChecklistCompleted = Object.values(closureData.completionChecklist).every(checked => checked);

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#27ae60', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>6</span>
          Close Permit - Safety Officer
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Final verification and closure of completed work permit
        </p>
      </div>

      {/* Work Completion Summary */}
      <div style={completionSectionStyles}>
        <h3 style={{ color: '#27ae60', marginBottom: '20px' }}>Work Completion Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px', marginBottom: '20px' }}>
          <div>
            <strong>Permit:</strong> {permit.permitNumber}
          </div>
          <div>
            <strong>Work Area:</strong> {permit.workArea}
          </div>
          <div>
            <strong>Location:</strong> {permit.location}
          </div>
          <div>
            <strong>Completed By:</strong> {permit.workCompletion?.completedBy}
          </div>
        </div>
        <div style={{ fontSize: '14px', color: '#2c3e50' }}>
          <strong>Final Progress:</strong> {permit.workCompletion?.finalProgress}% | 
          <strong> Duration:</strong> {permit.workCompletion?.totalDuration}
        </div>
      </div>

      {/* Completion Checklist */}
      <div style={completionSectionStyles}>
        <h3 style={{ color: '#27ae60', marginBottom: '20px' }}>Closure Verification Checklist</h3>
        <p style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '14px' }}>
          Verify that all work has been completed and the area has been restored to safe condition.
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
              <div style={{ flex: 1 }}>
                <label 
                  htmlFor={item.id}
                  style={{ 
                    fontWeight: '600', 
                    color: '#2c3e50',
                    cursor: 'pointer',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  {closureData.completionChecklist[item.id] ? '✅' : '◻️'} {item.label}
                </label>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
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
              ✅ All closure criteria verified and satisfied. Ready for final closure.
            </span>
          </div>
        )}
      </div>

      {/* Photo Evidence */}
      <div style={photoUploadSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📷 Closure Photo Evidence</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '14px' }}>
          Upload photos showing completed work, cleaned area, restored safety conditions, and returned permits
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
            Upload Closure Photos
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
                    alt={`Closure evidence ${index + 1}`}
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
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📝 Final Closure Remarks</h3>
        <textarea
          value={closureData.closureRemarks}
          onChange={handleRemarksChange}
          style={textareaStyles}
          placeholder="Provide final closure remarks, overall assessment, any outstanding issues, and recommendations for future work..."
        />
      </div>

      {/* Action Buttons */}
      <div style={buttonGroupStyles}>
        <button 
          style={{
            ...primaryButtonStyles,
            backgroundColor: allChecklistCompleted ? '#27ae60' : '#95a5a6'
          }}
          onClick={handleClosure}
          disabled={!allChecklistCompleted || closureData.closurePhotos.length === 0}
        >
          🔒 Close Permit & Archive
        </button>
      </div>

      {allChecklistCompleted && closureData.closurePhotos.length > 0 && (
        <div style={{
          backgroundColor: '#e8f4f8',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '20px',
          textAlign: 'center',
          border: '1px solid #3498db'
        }}>
          <div style={{ color: '#3498db', fontWeight: '600' }}>
            ✅ Ready for System Archiving
          </div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
            This permit will be archived and available for audit purposes
          </div>
        </div>
      )}
    </div>
  );
};

export default Step6ClosePermit;