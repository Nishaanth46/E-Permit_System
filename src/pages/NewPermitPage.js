import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PermitRequest from '../components/permits/PermitRequest';
import { toast } from 'react-toastify';

const containerStyles = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto'
};

const headerStyles = {
  marginBottom: '30px'
};

const titleStyles = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: 0
};

const subtitleStyles = {
  fontSize: '16px',
  color: '#7f8c8d',
  marginTop: '5px'
};

const NewPermitPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    navigate('/permits');
  };

  const handleSubmit = async (permitData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Permit request submitted successfully!');
      navigate('/permits');
    } catch (error) {
      toast.error('Failed to submit permit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>New Safety Permit</h1>
        <p style={subtitleStyles}>
          Complete the form below to request a new safety permit for your work
        </p>
      </div>

      <PermitRequest 
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {isSubmitting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <div>Submitting your permit request...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPermitPage;