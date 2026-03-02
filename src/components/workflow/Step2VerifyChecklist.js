import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SAFETY_CHECKLISTS } from '../../utils/constants';
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

const permitInfoStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const infoGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  fontSize: '14px'
};

const checklistSectionStyles = {
  marginBottom: '25px'
};

const categoryStyles = {
  backgroundColor: '#e8f4f8',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #3498db'
};

const categoryTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const questionItemStyles = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '15px',
  border: '1px solid #e9ecef',
  borderLeft: '4px solid #f39c12'
};

const verifiedQuestionStyles = {
  ...questionItemStyles,
  borderLeftColor: '#27ae60',
  backgroundColor: '#f0f9f0'
};

const questionTextStyles = {
  fontWeight: '600',
  marginBottom: '12px',
  color: '#2c3e50',
  fontSize: '14px'
};

const verificationOptionsStyles = {
  display: 'flex',
  gap: '20px',
  marginBottom: '15px',
  flexWrap: 'wrap'
};

const optionLabelStyles = {
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
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};

const actionSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '30px',
  border: '1px solid #e9ecef'
};

const textareaStyles = {
  width: '100%',
  padding: '12px',
  border: '1px solid #dcdfe6',
  borderRadius: '6px',
  fontSize: '14px',
  minHeight: '100px',
  resize: 'vertical',
  marginBottom: '15px'
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
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const secondaryButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const Step2VerifyChecklist = ({ permit, onComplete, onReject }) => {
  const { user } = useAuth();
  const [verificationData, setVerificationData] = useState({
    answers: {},
    photos: {},
    verifiedBy: user.name,
    verificationTime: new Date().toISOString(),
    remarks: ''
  });

  const checklist = SAFETY_CHECKLISTS[permit.workArea] || [];

  const handleAnswerChange = (questionId, answer) => {
    setVerificationData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: {
          answer,
          verifiedBy: user.name,
          timestamp: new Date().toISOString()
        }
      }
    }));
  };

  const handlePhotoUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVerificationData(prev => ({
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
        toast.success('Photo evidence uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemarksChange = (e) => {
    setVerificationData(prev => ({
      ...prev,
      remarks: e.target.value
    }));
  };

  const handleApprove = () => {
    const requiredQuestions = checklist.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => verificationData.answers[q.id]).length;
    
    if (answeredRequired < requiredQuestions.length) {
      toast.error('Please verify all required checklist items');
      return;
    }

    if (!verificationData.remarks.trim()) {
      toast.error('Please provide verification remarks');
      return;
    }

    const verifiedChecklist = {
      ...verificationData,
      verificationTime: new Date().toISOString(),
      status: 'verified'
    };

    onComplete(verifiedChecklist);
    toast.success('Safety checklist verified successfully!');
  };

  const handleReject = () => {
    if (!verificationData.remarks.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }
    onReject(verificationData.remarks);
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

  const requiredQuestions = checklist.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => verificationData.answers[q.id]).length;
  const completionPercentage = requiredQuestions.length > 0 ? 
    (answeredRequired / requiredQuestions.length) * 100 : 0;

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#27ae60', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
          Verify Checklist - Safety Officer
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Verify safety compliance through digital checklist and photo evidence
        </p>
      </div>

      {/* Permit Information */}
      <div style={permitInfoStyles}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Permit Details</h3>
        <div style={infoGridStyles}>
          <div>
            <strong>Work Area:</strong> {permit.workArea}
          </div>
          <div>
            <strong>Location:</strong> {permit.location}
          </div>
          <div>
            <strong>Requester:</strong> {permit.requester}
          </div>
          <div>
            <strong>Work Type:</strong> {permit.workType}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        backgroundColor: completionPercentage === 100 ? '#d5f4e6' : '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: `1px solid ${completionPercentage === 100 ? '#27ae60' : '#f39c12'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong>Verification Progress</strong>
          <span style={{ fontWeight: 'bold', color: completionPercentage === 100 ? '#27ae60' : '#f39c12' }}>
            {Math.round(completionPercentage)}% Complete
          </span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: '#ecf0f1',
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

      {/* Safety Checklist */}
      <div style={checklistSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Safety Checklist Verification</h3>
        
        {Object.entries(questionsByCategory).map(([category, questions]) => (
          <div key={category} style={categoryStyles}>
            <h4 style={categoryTitleStyles}>📋 {category}</h4>
            {questions.map(question => {
              const answer = verificationData.answers[question.id];
              const isVerified = answer && answer.answer === 'compliant';
              
              return (
                <div key={question.id} style={isVerified ? verifiedQuestionStyles : questionItemStyles}>
                  <div style={questionTextStyles}>
                    {question.question}
                    {question.required && (
                      <span style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        marginLeft: '10px'
                      }}>
                        REQUIRED
                      </span>
                    )}
                  </div>

                  <div style={verificationOptionsStyles}>
                    <label style={optionLabelStyles}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="compliant"
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        checked={answer?.answer === 'compliant'}
                      />
                      ✅ Compliant
                    </label>
                    <label style={optionLabelStyles}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="not-compliant"
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        checked={answer?.answer === 'not-compliant'}
                      />
                      ❌ Not Compliant
                    </label>
                    <label style={optionLabelStyles}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="not-applicable"
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        checked={answer?.answer === 'not-applicable'}
                      />
                      ⚪ Not Applicable
                    </label>
                  </div>

                  {/* Photo Evidence */}
                  <div style={photoSectionStyles}>
                    <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
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

                    {verificationData.photos[question.id] && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {verificationData.photos[question.id].map((photo, index) => (
                          <img 
                            key={index}
                            src={photo.url} 
                            alt={`Evidence ${index + 1}`}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {answer && (
                    <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '8px' }}>
                      Verified by: {answer.verifiedBy} at {new Date(answer.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Action Section */}
      <div style={actionSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Verification Remarks</h3>
        <textarea
          value={verificationData.remarks}
          onChange={handleRemarksChange}
          style={textareaStyles}
          placeholder="Enter your verification remarks, observations, and recommendations..."
        />
        
        <div style={buttonGroupStyles}>
          <button 
            type="button" 
            style={secondaryButtonStyles}
            onClick={handleReject}
          >
            ❌ Reject Checklist
          </button>
          <button 
            type="button" 
            style={{
              ...primaryButtonStyles,
              backgroundColor: completionPercentage === 100 ? '#27ae60' : '#95a5a6'
            }}
            onClick={handleApprove}
            disabled={completionPercentage < 100}
          >
            ✅ Approve & Forward to Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2VerifyChecklist;