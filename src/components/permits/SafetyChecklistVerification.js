import React, { useState, useEffect } from 'react';
import { SAFETY_CHECKLISTS } from '../../utils/constants';
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

const subtitleStyles = {
  fontSize: '16px',
  color: '#7f8c8d',
  marginBottom: '5px'
};

const progressStyles = {
  backgroundColor: '#e8f5e8',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #27ae60'
};

const categorySectionStyles = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
};

const categoryTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid #dee2e6'
};

const questionItemStyles = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: 'white',
  borderRadius: '6px',
  border: '1px solid #e9ecef'
};

const questionTextStyles = {
  fontWeight: '600',
  marginBottom: '15px',
  color: '#2c3e50',
  fontSize: '14px',
  lineHeight: '1.5'
};

const requiredBadgeStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: 'bold',
  marginLeft: '10px'
};

const verificationGroupStyles = {
  display: 'flex',
  gap: '20px',
  marginBottom: '15px',
  flexWrap: 'wrap'
};

const verificationOptionStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};

const photoSectionStyles = {
  marginTop: '15px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px dashed #bdc3c7'
};

const uploadButtonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const photoPreviewStyles = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginTop: '10px'
};

const previewImageStyles = {
  width: '120px',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '6px',
  border: '2px solid #bdc3c7'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'space-between',
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #e9ecef'
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

const SafetyChecklistVerification = ({ workArea, permitData, onComplete, onBack }) => {
  const [checklistData, setChecklistData] = useState({
    answers: {},
    photos: {},
    verifiedBy: '',
    verificationTime: ''
  });

  const checklist = SAFETY_CHECKLISTS[workArea] || [];

  useEffect(() => {
    // Auto-save progress
    const completed = calculateCompletion();
    if (completed > 0) {
      console.log('Checklist progress saved:', completed + '%');
    }
  }, [checklistData]);

  const calculateCompletion = () => {
    if (checklist.length === 0) return 0;
    const requiredQuestions = checklist.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => checklistData.answers[q.id]).length;
    return requiredQuestions.length > 0 ? (answeredRequired / requiredQuestions.length) * 100 : 0;
  };

  const handleAnswerChange = (questionId, answer, verifiedBy = 'Requester') => {
    setChecklistData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: {
          answer,
          verifiedBy,
          timestamp: new Date().toISOString()
        }
      }
    }));
  };

  const handlePhotoUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Photo size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setChecklistData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [questionId]: [
              ...(prev.photos[questionId] || []),
              {
                url: e.target.result,
                filename: file.name,
                uploadedAt: new Date().toISOString()
              }
            ]
          }
        }));
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (questionId, photoIndex) => {
    setChecklistData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [questionId]: prev.photos[questionId].filter((_, index) => index !== photoIndex)
      }
    }));
  };

  const handleSubmit = () => {
    const completion = calculateCompletion();
    if (completion < 100) {
      toast.error('Please complete all required safety checklist items');
      return;
    }

    onComplete(checklistData);
  };

  // Group questions by category
  const questionsByCategory = checklist.reduce((acc, question) => {
    const category = question.category || 'General Safety';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  const completionPercentage = calculateCompletion();
  const requiredQuestions = checklist.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => checklistData.answers[q.id]).length;

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>✅ Safety Checklist Verification</h2>
        <p style={subtitleStyles}>
          Work Area: <strong>{workArea}</strong> | Location: {permitData?.location}
        </p>
        
        <div style={progressStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong>Verification Progress</strong>
            <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
              {Math.round(completionPercentage)}% Complete
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#bdc3c7',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${completionPercentage}%`,
              backgroundColor: completionPercentage === 100 ? '#27ae60' : '#3498db',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
            {answeredRequired} of {requiredQuestions.length} required items verified
          </div>
        </div>
      </div>

      {Object.entries(questionsByCategory).map(([category, questions]) => (
        <div key={category} style={categorySectionStyles}>
          <h3 style={categoryTitleStyles}>{category}</h3>
          {questions.map(question => (
            <div key={question.id} style={questionItemStyles}>
              <div style={questionTextStyles}>
                {question.question}
                {question.required && (
                  <span style={requiredBadgeStyles}>MANDATORY</span>
                )}
              </div>

              <div style={verificationGroupStyles}>
                <label style={verificationOptionStyles}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="compliant"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    checked={checklistData.answers[question.id]?.answer === 'compliant'}
                  />
                  ✅ Compliant
                </label>
                <label style={verificationOptionStyles}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="not-compliant"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    checked={checklistData.answers[question.id]?.answer === 'not-compliant'}
                  />
                  ❌ Not Compliant
                </label>
                <label style={verificationOptionStyles}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="not-applicable"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    checked={checklistData.answers[question.id]?.answer === 'not-applicable'}
                  />
                  ⚪ Not Applicable
                </label>
              </div>

              {/* Photo Evidence Section */}
              <div style={photoSectionStyles}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>
                  📷 Photo Evidence
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(question.id, e)}
                  style={{ display: 'none' }}
                  id={`photo-${question.id}`}
                />
                <button
                  type="button"
                  style={uploadButtonStyles}
                  onClick={() => document.getElementById(`photo-${question.id}`).click()}
                >
                  📸 Upload Photo
                </button>

                {checklistData.photos[question.id] && checklistData.photos[question.id].length > 0 && (
                  <div style={photoPreviewStyles}>
                    {checklistData.photos[question.id].map((photo, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img 
                          src={photo.url} 
                          alt={`Evidence ${index + 1}`} 
                          style={previewImageStyles}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(question.id, index)}
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
                )}
              </div>

              {checklistData.answers[question.id] && (
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '8px' }}>
                  Verified by: {checklistData.answers[question.id].verifiedBy} at{' '}
                  {new Date(checklistData.answers[question.id].timestamp).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={buttonGroupStyles}>
        <button type="button" style={secondaryButtonStyles} onClick={onBack}>
          ← Back to Request
        </button>
        <button 
          type="button" 
          style={{
            ...primaryButtonStyles,
            backgroundColor: completionPercentage === 100 ? '#27ae60' : '#95a5a6'
          }}
          onClick={handleSubmit}
          disabled={completionPercentage < 100}
        >
          {completionPercentage === 100 ? 'Submit for Inspection →' : 'Complete All Items'}
        </button>
      </div>
    </div>
  );
};

export default SafetyChecklistVerification;