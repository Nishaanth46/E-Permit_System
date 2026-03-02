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

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px'
};

const formStyles = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px'
};

const listStyles = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px'
};

const formGroupStyles = {
  marginBottom: '15px'
};

const labelStyles = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: '600',
  color: '#2c3e50'
};

const inputStyles = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #bdc3c7',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const buttonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
};

const areaListStyles = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const areaItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  marginBottom: '8px',
  backgroundColor: 'white',
  borderRadius: '4px',
  border: '1px solid #e0e0e0'
};

const areaInfoStyles = {
  display: 'flex',
  flexDirection: 'column'
};

const areaNameStyles = {
  fontWeight: 'bold',
  color: '#2c3e50'
};

const areaCodeStyles = {
  fontSize: '12px',
  color: '#7f8c8d'
};

const deleteButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const WorkAreaManager = () => {
  const [workAreas, setWorkAreas] = useState([
    { id: 1, name: 'Confined Space', code: 'CS' },
    { id: 2, name: 'Hot Work', code: 'HW' },
    { id: 3, name: 'Electrical Work', code: 'ELEC' },
    { id: 4, name: 'Height Work', code: 'HEIGHT' },
    { id: 5, name: 'Excavation', code: 'EXCA' },
    { id: 6, name: 'Chemical Handling', code: 'CHEM' },
    { id: 7, name: 'Machine Maintenance', code: 'MACHINE' }
  ]);

  const [newArea, setNewArea] = useState({
    name: '',
    code: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArea(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddArea = (e) => {
    e.preventDefault();
    
    if (!newArea.name || !newArea.code) {
      toast.error('Please fill in all fields');
      return;
    }

    const newAreaWithId = {
      id: Date.now(),
      name: newArea.name,
      code: newArea.code.toUpperCase()
    };

    setWorkAreas(prev => [...prev, newAreaWithId]);
    setNewArea({ name: '', code: '' });
    toast.success('Work area added successfully!');
  };

  const handleDeleteArea = (id) => {
    if (workAreas.length <= 1) {
      toast.error('Cannot delete all work areas');
      return;
    }

    setWorkAreas(prev => prev.filter(area => area.id !== id));
    toast.success('Work area deleted successfully!');
  };

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Manage Work Areas</h3>
      
      <div style={gridStyles}>
        <div style={formStyles}>
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Add New Work Area</h4>
          <form onSubmit={handleAddArea}>
            <div style={formGroupStyles}>
              <label style={labelStyles}>Area Name</label>
              <input
                type="text"
                name="name"
                value={newArea.name}
                onChange={handleInputChange}
                style={inputStyles}
                placeholder="e.g., Confined Space"
              />
            </div>
            
            <div style={formGroupStyles}>
              <label style={labelStyles}>Area Code</label>
              <input
                type="text"
                name="code"
                value={newArea.code}
                onChange={handleInputChange}
                style={inputStyles}
                placeholder="e.g., CS"
                maxLength="10"
              />
            </div>
            
            <button type="submit" style={buttonStyles}>
              Add Work Area
            </button>
          </form>
        </div>

        <div style={listStyles}>
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>
            Existing Work Areas ({workAreas.length})
          </h4>
          
          <ul style={areaListStyles}>
            {workAreas.map(area => (
              <li key={area.id} style={areaItemStyles}>
                <div style={areaInfoStyles}>
                  <span style={areaNameStyles}>{area.name}</span>
                  <span style={areaCodeStyles}>Code: {area.code}</span>
                </div>
                <button
                  style={deleteButtonStyles}
                  onClick={() => handleDeleteArea(area.id)}
                  disabled={workAreas.length <= 1}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkAreaManager;