// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get all users (demo users + stored users)
  const getAllUsers = () => {
    // Demo users for testing
    const demoUsers = [
      {
        id: 1,
        name: 'John Requester',
        email: 'requester@company.com',
        password: 'password123',
        role: 'requester',
        department: 'Operations'
      },
      {
        id: 2,
        name: 'Sarah Safety',
        email: 'safety@company.com',
        password: 'password123',
        role: 'safety_officer',
        department: 'Safety'
      },
      {
        id: 3,
        name: 'Mike Inspector',
        email: 'inspector@company.com',
        password: 'password123',
        role: 'inspector',
        department: 'Quality Control'
      },
      {
        id: 4,
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        department: 'Administration'
      },
      {
        id: 5,
        name: 'David Approver',
        email: 'approver@company.com',
        password: 'password123',
        role: 'approver',
        department: 'Management'
      }
    ];

    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Combine demo users with stored users, avoiding duplicates by email
    const allUsers = [...demoUsers];
    storedUsers.forEach(storedUser => {
      if (!allUsers.find(user => user.email === storedUser.email)) {
        allUsers.push(storedUser);
      }
    });
    
    return allUsers;
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all users (demo + stored)
      const allUsers = getAllUsers();
      
      // Find user in all users
      const foundUser = allUsers.find(
        user => user.email === email && user.password === password
      );

      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Remove password from state
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      } else {
        toast.error('Invalid email or password');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('lastRoute');
    localStorage.removeItem('intendedDestination');
    toast.info('Logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};