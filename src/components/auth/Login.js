// src/components/auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const containerStyles = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  padding: '20px'
};

const cardStyles = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
};

const titleStyles = {
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: '30px',
  fontSize: '28px',
  fontWeight: 'bold'
};

const inputStyles = {
  width: '100%',
  padding: '15px',
  border: '1px solid #dcdfe6',
  borderRadius: '8px',
  fontSize: '16px',
  marginBottom: '20px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s ease'
};

const buttonStyles = {
  width: '100%',
  padding: '15px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

const demoUsersStyles = {
  marginTop: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to intended page or home
        const intendedDestination = localStorage.getItem('intendedDestination');
        if (intendedDestination && intendedDestination !== '/login') {
          localStorage.removeItem('intendedDestination');
          navigate(intendedDestination, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  const demoUsers = [
    { email: 'requester@company.com', password: 'password123', role: 'Requester' },
    { email: 'safety@company.com', password: 'password123', role: 'Safety Officer' },
    { email: 'inspector@company.com', password: 'password123', role: 'Inspector' },
    { email: 'admin@company.com', password: 'admin123', role: 'Admin' },
    { email: 'approver@company.com', password: 'password123', role: 'Approver' }
  ];

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>E-Permit System</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyles}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyles}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...buttonStyles,
              backgroundColor: isLoading ? '#95a5a6' : '#3498db',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Users Section */}
        <div style={demoUsersStyles}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#2c3e50' }}>
            Demo Users
          </h3>
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>
            Click any user to auto-fill credentials
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {demoUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoCredentials(user.email, user.password)}
                style={{
                  padding: '10px',
                  border: '1px solid #3498db',
                  backgroundColor: 'transparent',
                  color: '#3498db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.backgroundColor = '#3498db';
                  e.target.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.backgroundColor = 'transparent';
                  e.target.color = '#3498db';
                }}
              >
                {user.role} - {user.email}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#7f8c8d', fontSize: '12px' }}>
            Default password for all users (except admin): <strong>password123</strong>
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '12px' }}>
            Admin password: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;