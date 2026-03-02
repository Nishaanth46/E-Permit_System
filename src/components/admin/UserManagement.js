import React, { useState } from 'react';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const titleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '20px'
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse'
};

const thStyles = {
  backgroundColor: '#34495e',
  color: 'white',
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px'
};

const tdStyles = {
  padding: '12px 15px',
  borderBottom: '1px solid #ecf0f1',
  fontSize: '14px'
};

const roleBadgeStyles = (role) => {
  const colors = {
    admin: '#e74c3c',
    safety_officer: '#3498db',
    approver: '#f39c12',
    requester: '#27ae60'
  };
  
  return {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: colors[role] + '20',
    color: colors[role],
    textTransform: 'capitalize'
  };
};

const actionButtonStyles = {
  padding: '6px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  marginRight: '8px'
};

const editButtonStyles = {
  ...actionButtonStyles,
  backgroundColor: '#3498db',
  color: 'white'
};

const deleteButtonStyles = {
  ...actionButtonStyles,
  backgroundColor: '#e74c3c',
  color: 'white'
};

const addButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '20px'
};

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto'
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputStyles = {
  padding: '10px',
  border: '1px solid #dcdfe6',
  borderRadius: '4px',
  fontSize: '14px'
};

const selectStyles = {
  padding: '10px',
  border: '1px solid #dcdfe6',
  borderRadius: '4px',
  fontSize: '14px',
  backgroundColor: 'white'
};

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'requester@company.com',
      role: 'requester',
      department: 'Maintenance',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'safety@company.com',
      role: 'safety_officer',
      department: 'Safety',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'approver@company.com',
      role: 'approver',
      department: 'Operations',
      status: 'active'
    },
    {
      id: 4,
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'admin',
      department: 'IT',
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'requester',
    department: '',
    password: ''
  });

  const handleEditUser = (userId) => {
    toast.info('Edit user functionality would open a modal in real implementation');
  };

  const handleDeleteUser = (userId) => {
    if (users.length <= 1) {
      toast.error('Cannot delete all users');
      return;
    }

    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User deleted successfully!');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!newUser.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    const userExists = users.some(user => user.email === newUser.email);
    if (userExists) {
      toast.error('A user with this email already exists');
      return;
    }

    const newUserData = {
      id: users.length + 1,
      ...newUser,
      status: 'active'
    };

    setUsers(prev => [...prev, newUserData]);
    toast.success(`New user "${newUser.name}" created successfully with role "${newUser.role.replace('_', ' ')}"!`);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'requester',
      department: '',
      password: ''
    });
    setShowAddModal(false);
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={containerStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={titleStyles}>User Management</h3>
        <button style={addButtonStyles} onClick={() => setShowAddModal(true)}>
          + Add New User
        </button>
      </div>

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Name</th>
            <th style={thStyles}>Email</th>
            <th style={thStyles}>Role</th>
            <th style={thStyles}>Department</th>
            <th style={thStyles}>Status</th>
            <th style={thStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={tdStyles}>
                <strong>{user.name}</strong>
              </td>
              <td style={tdStyles}>{user.email}</td>
              <td style={tdStyles}>
                <span style={roleBadgeStyles(user.role)}>
                  {user.role.replace('_', ' ')}
                </span>
              </td>
              <td style={tdStyles}>{user.department}</td>
              <td style={tdStyles}>
                <span style={{
                  color: user.status === 'active' ? '#27ae60' : '#e74c3c',
                  fontWeight: '600'
                }}>
                  {user.status.toUpperCase()}
                </span>
              </td>
              <td style={tdStyles}>
                <button 
                  style={editButtonStyles}
                  onClick={() => handleEditUser(user.id)}
                >
                  Edit
                </button>
                <button 
                  style={deleteButtonStyles}
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={users.length <= 1}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          No users found
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#2c3e50', margin: 0 }}>Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{...actionButtonStyles, backgroundColor: '#7f8c8d', color: 'white'}}
              >
                ✕ Close
              </button>
            </div>

            <form style={formStyles}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={selectStyles}
                  required
                >
                  <option value="requester">Requester</option>
                  <option value="safety_officer">Safety Officer</option>
                  <option value="approver">Approver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Department *
                </label>
                <input
                  type="text"
                  placeholder="Enter department"
                  value={newUser.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleAddUser}
                  style={{...addButtonStyles, marginBottom: 0}}
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{...actionButtonStyles, backgroundColor: '#7f8c8d', color: 'white', padding: '10px 20px'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;