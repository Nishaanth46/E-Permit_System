import React, { useState, useEffect } from 'react';
import { SAFETY_CHECKLISTS } from '../../utils/constants';

const checklistStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0'
};

const sectionTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '2px solid #3498db'
};

const categorySectionStyles = {
  marginBottom: '30px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px'
};

const categoryTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  paddingBottom: '8px',
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
  marginBottom: '10px',
  color: '#2c3e50',
  fontSize: '14px'
};

const requiredBadgeStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  marginLeft: '8px'
};

const radioGroupStyles = {
  display: 'flex',
  gap: '20px',
  marginBottom: '15px'
};

const radioLabelStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};

const photoUploadStyles = {
  marginTop: '15px'
};

const uploadButtonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const photoPreviewStyles = {
  marginTop: '10px',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const previewImageStyles = {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: '1px solid #bdc3c7'
};

const completionStatusStyles = {
  padding: '10px',
  backgroundColor: '#e8f5e8',
  borderRadius: '4px',
  marginBottom: '20px',
  border: '1px solid #27ae60'
};

const SafetyChecklist = ({ workArea, onChecklistChange }) => {
  const [answers, setAnswers] = useState({});
  const [photos, setPhotos] = useState({});

  const checklist = SAFETY_CHECKLISTS[workArea] || [];

  useEffect(() => {
    onChecklistChange({
      answers,
      photos,
      completed: calculateCompletion()
    });
  }, [answers, photos, onChecklistChange]);

  const calculateCompletion = () => {
    if (checklist.length === 0) return 0;
    const requiredQuestions = checklist.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => answers[q.id]).length;
    return requiredQuestions.length > 0 ? (answeredRequired / requiredQuestions.length) * 100 : 100;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handlePhotoUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => ({
          ...prev,
          [questionId]: [...(prev[questionId] || []), e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (questionId, photoIndex) => {
    setPhotos(prev => ({
      ...prev,
      [questionId]: prev[questionId].filter((_, index) => index !== photoIndex)
    }));
  };

  // Group questions by category
  const questionsByCategory = checklist.reduce((acc, question) => {
    const category = question.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  if (!workArea) {
    return (
      <div style={checklistStyles}>
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
          Please select a work area first to see the safety checklist
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();
  const requiredQuestions = checklist.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => answers[q.id]).length;

  return (
    <div style={checklistStyles}>
      <h3 style={sectionTitleStyles}>
        Safety Verification Checklist
        <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '10px' }}>
          ({checklist.length} verification items)
        </span>
      </h3>

      {completionPercentage < 100 && (
        <div style={completionStatusStyles}>
          <strong>Completion Status: {Math.round(completionPercentage)}%</strong>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>
            {answeredRequired} of {requiredQuestions.length} required questions answered
          </div>
          <div style={{
            height: '6px',
            backgroundColor: '#bdc3c7',
            borderRadius: '3px',
            marginTop: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${completionPercentage}%`,
              backgroundColor: completionPercentage === 100 ? '#27ae60' : '#3498db',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {checklist.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
          No safety checklist available for this work area.
        </div>
      ) : (
        Object.entries(questionsByCategory).map(([category, questions]) => (
          <div key={category} style={categorySectionStyles}>
            <h4 style={categoryTitleStyles}>{category}</h4>
            {questions.map(question => (
              <div key={question.id} style={questionItemStyles}>
                <div style={questionTextStyles}>
                  {question.question}
                  {question.required && (
                    <span style={requiredBadgeStyles}>REQUIRED</span>
                  )}
                </div>

                <div style={radioGroupStyles}>
                  <label style={radioLabelStyles}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="yes"
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      checked={answers[question.id] === 'yes'}
                    />
                    Yes - Compliant
                  </label>
                  <label style={radioLabelStyles}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="no"
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      checked={answers[question.id] === 'no'}
                    />
                    No - Not Compliant
                  </label>
                  <label style={radioLabelStyles}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="na"
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      checked={answers[question.id] === 'na'}
                    />
                    Not Applicable
                  </label>
                </div>

                <div style={photoUploadStyles}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                    Upload Photo Evidence:
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
                    📷 Add Photo Evidence
                  </button>

                  {photos[question.id] && photos[question.id].length > 0 && (
                    <div style={photoPreviewStyles}>
                      {photos[question.id].map((photo, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img 
                            src={photo} 
                            alt={`Evidence ${index + 1}`} 
                            style={previewImageStyles}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(question.id, index)}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
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
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default SafetyChecklist;