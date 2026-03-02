import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermit } from '../context/PermitContext';
import { toast } from 'react-toastify';
import UserManagement from '../components/admin/UserManagement';

const containerStyles = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerStyles = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const cardStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const statCardStyles = {
  ...cardStyles,
  textAlign: 'center',
  borderLeft: '4px solid #3498db'
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '15px'
};

const thStyles = {
  backgroundColor: '#f8f9fa',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #e9ecef',
  fontWeight: '600',
  color: '#2c3e50'
};

const tdStyles = {
  padding: '12px',
  borderBottom: '1px solid #e9ecef',
  color: '#495057'
};

const badgeStyles = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  display: 'inline-block'
};

const statusColors = {
  pending_checklist: { backgroundColor: '#fff3cd', color: '#856404' },
  pending_inspection: { backgroundColor: '#fff3cd', color: '#856404' },
  pending_approval: { backgroundColor: '#fff3cd', color: '#856404' },
  approved: { backgroundColor: '#d4edda', color: '#155724' },
  rejected: { backgroundColor: '#f8d7da', color: '#721c24' },
  closed: { backgroundColor: '#d1ecf1', color: '#0c5460' },
  stopped: { backgroundColor: '#e2e3e5', color: '#383d41' }
};

const buttonStyles = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
  margin: '2px'
};

const tabContainerStyles = {
  display: 'flex',
  marginBottom: '20px',
  borderBottom: '1px solid #e9ecef'
};

const tabStyles = {
  padding: '12px 24px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: '600',
  color: '#7f8c8d',
  borderBottom: '2px solid transparent'
};

const activeTabStyles = {
  ...tabStyles,
  color: '#3498db',
  borderBottom: '2px solid #3498db'
};

const chartContainerStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  marginBottom: '20px'
};

// Mock users data (in real app, this would come from context/API)
const mockUsers = [
  { id: 1, name: 'John Requester', email: 'john@company.com', role: 'requester', status: 'active' },
  { id: 2, name: 'Sarah Safety', email: 'sarah@company.com', role: 'safety_officer', status: 'active' },
  { id: 3, name: 'Mike Inspector', email: 'mike@company.com', role: 'inspector', status: 'active' },
  { id: 4, name: 'Jane Approver', email: 'jane@company.com', role: 'approver', status: 'active' },
  { id: 5, name: 'Admin User', email: 'admin@company.com', role: 'admin', status: 'active' }
];

const AdminPage = () => {
  const { user } = useAuth();
  const { permits, workAreas, getStatistics, deletePermit, updatePermit } = usePermit();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load users from localStorage or use mockUsers as fallback
  const [users, setUsers] = useState(() => {
    const storedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    return storedUsers.length > 0 ? storedUsers : mockUsers;
  });
  
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'requester',
    department: '',
    status: 'active'
  });

  const stats = getStatistics();

  // Contextual search based on active tab
  const getSearchPlaceholder = () => {
    switch(activeTab) {
      case 'overview':
      case 'permits':
        return 'Search permits by number, work area, requester, or location...';
      case 'workareas':
        return 'Search work areas by name or code...';
      case 'users':
        return 'Search users by name or email...';
      case 'analytics':
        return 'Search analytics data...';
      default:
        return 'Search...';
    }
  };

  // Filter permits based on search term
  const filteredPermits = permits.filter(permit => 
    permit.permitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.workArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.requester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter work areas based on search term
  const filteredWorkAreas = workAreas.filter(area =>
    area.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePermit = async (permitId) => {
    if (window.confirm('Are you sure you want to delete this permit? This action cannot be undone.')) {
      try {
        await deletePermit(permitId);
        toast.success('Permit deleted successfully');
      } catch (error) {
        toast.error('Failed to delete permit');
      }
    }
  };

  const handleStatusUpdate = async (permitId, newStatus) => {
    try {
      await updatePermit(permitId, { status: newStatus });
      toast.success(`Permit status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update permit status');
    }
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast.error('Please fill in all required fields including password');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast.error('A user with this email already exists');
      return;
    }

    const userToAdd = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      department: newUser.department || 'General'
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    
    // Store users in localStorage for persistence
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'requester',
      department: '',
      status: 'active'
    });
    setShowCreateUserModal(false);
    toast.success('User created successfully. They can now log in with their credentials.');
  };

  const handleUpdateUserStatus = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    ));
    toast.success(`User ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
  };

  const exportToCSV = () => {
    const headers = ['Permit Number', 'Work Area', 'Status', 'Requester', 'Location', 'Submitted Date'];
    const csvData = permits.map(permit => [
      permit.permitNumber,
      permit.workArea,
      permit.status,
      permit.requester,
      permit.location,
      new Date(permit.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `permits-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported to CSV successfully');
  };

  // Work Area Statistics
  const workAreaStats = workAreas.map(area => ({
    ...area,
    count: permits.filter(p => p.workArea === area.code).length,
    percentage: ((permits.filter(p => p.workArea === area.code).length / permits.length) * 100).toFixed(1)
  }));

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Admin Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Welcome back, {user.name}. Manage all permits and system analytics.</p>
        
        {/* Quick Stats */}
        <div style={gridStyles}>
          <div style={statCardStyles}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{stats.total}</div>
            <div style={{ color: '#7f8c8d' }}>Total Permits</div>
          </div>
          <div style={{...statCardStyles, borderLeftColor: '#27ae60'}}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{stats.approved}</div>
            <div style={{ color: '#7f8c8d' }}>Approved</div>
          </div>
          <div style={{...statCardStyles, borderLeftColor: '#f39c12'}}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>{stats.pending}</div>
            <div style={{ color: '#7f8c8d' }}>Pending</div>
          </div>
          <div style={{...statCardStyles, borderLeftColor: '#e74c3c'}}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{stats.rejected}</div>
            <div style={{ color: '#7f8c8d' }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={tabContainerStyles}>
        <button 
          style={activeTab === 'overview' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          style={activeTab === 'permits' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('permits')}
        >
          📋 All Permits ({permits.length})
        </button>
        <button 
          style={activeTab === 'analytics' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          style={activeTab === 'workareas' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('workareas')}
        >
          🏗️ Work Areas
        </button>
        <button 
          style={activeTab === 'users' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
      </div>

      {/* Search and Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' }}>
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #dcdfe6',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={exportToCSV}
          style={{
            ...buttonStyles,
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '12px 20px'
          }}
        >
          📥 Export CSV
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Recent Activity */}
          <div style={cardStyles}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th style={thStyles}>Permit Number</th>
                    <th style={thStyles}>Work Area</th>
                    <th style={thStyles}>Requester</th>
                    <th style={thStyles}>Status</th>
                    <th style={thStyles}>Submitted</th>
                    <th style={thStyles}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermits.slice(0, 10).map(permit => (
                    <tr key={permit.id}>
                      <td style={tdStyles}>
                        <strong>{permit.permitNumber}</strong>
                      </td>
                      <td style={tdStyles}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{workAreas.find(wa => wa.code === permit.workArea)?.icon || '🛠️'}</span>
                          {permit.workArea}
                        </div>
                      </td>
                      <td style={tdStyles}>{permit.requester}</td>
                      <td style={tdStyles}>
                        <span style={{
                          ...badgeStyles,
                          ...statusColors[permit.status]
                        }}>
                          {permit.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={tdStyles}>
                        {new Date(permit.submittedAt).toLocaleDateString()}
                      </td>
                      <td style={tdStyles}>
                        <button
                          onClick={() => setSelectedPermit(permit)}
                          style={{...buttonStyles, backgroundColor: '#3498db', color: 'white'}}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeletePermit(permit.id)}
                          style={{...buttonStyles, backgroundColor: '#e74c3c', color: 'white'}}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permits' && (
        <div style={cardStyles}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>All Permits</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>Permit Number</th>
                  <th style={thStyles}>Work Area</th>
                  <th style={thStyles}>Requester</th>
                  <th style={thStyles}>Location</th>
                  <th style={thStyles}>Status</th>
                  <th style={thStyles}>Submitted</th>
                  <th style={thStyles}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermits.map(permit => (
                  <tr key={permit.id}>
                    <td style={tdStyles}>
                      <strong>{permit.permitNumber}</strong>
                    </td>
                    <td style={tdStyles}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{workAreas.find(wa => wa.code === permit.workArea)?.icon || '🛠️'}</span>
                        {permit.workArea}
                      </div>
                    </td>
                    <td style={tdStyles}>{permit.requester}</td>
                    <td style={tdStyles}>{permit.location}</td>
                    <td style={tdStyles}>
                      <span style={{
                        ...badgeStyles,
                        ...statusColors[permit.status]
                      }}>
                        {permit.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      {new Date(permit.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyles}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <button
                          onClick={() => setSelectedPermit(permit)}
                          style={{...buttonStyles, backgroundColor: '#3498db', color: 'white'}}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeletePermit(permit.id)}
                          style={{...buttonStyles, backgroundColor: '#e74c3c', color: 'white'}}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <div style={gridStyles}>
            {/* Status Distribution */}
            <div style={chartContainerStyles}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Status Distribution</h3>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                    <span style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / stats.total) * 100}%`,
                      height: '100%',
                      backgroundColor: statusColors[status]?.color || '#3498db',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Work Area Distribution */}
            <div style={chartContainerStyles}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Work Area Distribution</h3>
              {workAreaStats.map(area => (
                <div key={area.code} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{area.name}</span>
                    <span style={{ fontWeight: '600' }}>{area.count}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${area.percentage}%`,
                      height: '100%',
                      backgroundColor: '#3498db',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div style={chartContainerStyles}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Monthly Trends</h3>
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📈</div>
              <p>Monthly analytics chart would be displayed here</p>
              <p style={{ fontSize: '12px' }}>Integration with charts library required</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workareas' && (
        <div style={cardStyles}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Work Areas Management</h3>
          <div style={gridStyles}>
            {filteredWorkAreas.map(area => {
              const areaStats = workAreaStats.find(stat => stat.code === area.code);
              return (
                <div key={area.code} style={{
                  ...cardStyles,
                  borderLeft: `4px solid ${area.riskLevel === 'High' ? '#e74c3c' : area.riskLevel === 'Medium' ? '#f39c12' : '#27ae60'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{area.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>{area.name}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{area.code}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      ...badgeStyles,
                      backgroundColor: area.riskLevel === 'High' ? '#f8d7da' : area.riskLevel === 'Medium' ? '#fff3cd' : '#d4edda',
                      color: area.riskLevel === 'High' ? '#721c24' : area.riskLevel === 'Medium' ? '#856404' : '#155724'
                    }}>
                      {area.riskLevel} Risk
                    </span>
                    <span style={{ fontWeight: '600', color: '#3498db' }}>
                      {areaStats?.count || 0} permits
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={cardStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50', margin: 0 }}>User Management</h3>
            <button
              onClick={() => setShowCreateUserModal(true)}
              style={{
                ...buttonStyles,
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '10px 20px'
              }}
            >
              Create User
            </button>
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>Name</th>
                  <th style={thStyles}>Email</th>
                  <th style={thStyles}>Role</th>
                  <th style={thStyles}>Status</th>
                  <th style={thStyles}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={tdStyles}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#3498db',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td style={tdStyles}>{user.email}</td>
                    <td style={tdStyles}>
                      <span style={{
                        ...badgeStyles,
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2'
                      }}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <span style={{
                        ...badgeStyles,
                        backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                        color: user.status === 'active' ? '#155724' : '#721c24'
                      }}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          style={{...buttonStyles, backgroundColor: '#3498db', color: 'white'}}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          style={{...buttonStyles, backgroundColor: '#f39c12', color: 'white'}}
                        >
                          {user.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Create New User</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter user name"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter email address"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>Password *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter password"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="requester">Requester</option>
                <option value="safety_officer">Safety Officer</option>
                <option value="inspector">Inspector</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #dcdfe6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter department (optional)"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setShowCreateUserModal(false);
                  setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'requester',
                    department: '',
                    status: 'active'
                  });
                }}
                style={{...buttonStyles, backgroundColor: '#7f8c8d', color: 'white'}}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                style={{...buttonStyles, backgroundColor: '#27ae60', color: 'white'}}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permit Details Modal */}
      {selectedPermit && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Permit Details - {selectedPermit.permitNumber}</h3>
              <button
                onClick={() => setSelectedPermit(null)}
                style={{...buttonStyles, backgroundColor: '#7f8c8d', color: 'white'}}
              >
                Close
              </button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Work Area:</strong> {selectedPermit.workArea}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Location:</strong> {selectedPermit.location}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Requester:</strong> {selectedPermit.requester}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong> 
              <span style={{
                ...badgeStyles,
                ...statusColors[selectedPermit.status],
                marginLeft: '10px'
              }}>
                {selectedPermit.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Description:</strong> {selectedPermit.workDescription}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Submitted:</strong> {new Date(selectedPermit.submittedAt).toLocaleString()}
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleStatusUpdate(selectedPermit.id, 'approved')}
                style={{...buttonStyles, backgroundColor: '#27ae60', color: 'white'}}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedPermit.id, 'rejected')}
                style={{...buttonStyles, backgroundColor: '#e74c3c', color: 'white'}}
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedPermit.id, 'closed')}
                style={{...buttonStyles, backgroundColor: '#3498db', color: 'white'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;