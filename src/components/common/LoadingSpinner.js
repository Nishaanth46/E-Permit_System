import React from 'react';

const spinnerContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px'
};

const spinnerStyles = {
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const LoadingSpinner = ({ size = 40 }) => {
  const customSpinnerStyles = {
    ...spinnerStyles,
    width: `${size}px`,
    height: `${size}px`
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={spinnerContainerStyles}>
        <div style={customSpinnerStyles}></div>
      </div>
    </>
  );
};

export default LoadingSpinner;