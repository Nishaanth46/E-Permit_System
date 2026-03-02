import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '1000px',
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

const monitoringGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const statusCardStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const activeCardStyles = {
  ...statusCardStyles,
  borderColor: '#3498db',
  backgroundColor: '#ebf5fb'
};

const timerStyles = {
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#2c3e50',
  margin: '20px 0'
};

const progressSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const progressBarStyles = {
  height: '10px',
  backgroundColor: '#ecf0f1',
  borderRadius: '5px',
  overflow: 'hidden',
  margin: '15px 0'
};

const progressFillStyles = (percentage) => ({
  height: '100%',
  width: `${percentage}%`,
  backgroundColor: percentage < 50 ? '#e74c3c' : percentage < 80 ? '#f39c12' : '#27ae60',
  borderRadius: '5px',
  transition: 'width 0.5s ease'
});

const updateSectionStyles = {
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #3498db'
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
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const warningButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const WorkExecutionMonitoring = ({ permit, onWorkComplete, onWorkStop }) => {
  const { user } = useAuth();
  const [workStatus, setWorkStatus] = useState('in_progress');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workUpdates, setWorkUpdates] = useState([]);
  const [currentUpdate, setCurrentUpdate] = useState('');

  useEffect(() => {
    // Start timer when component mounts
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const startTime = new Date(permit.startDate).getTime();
    const endTime = new Date(permit.endDate).getTime();
    const currentTime = new Date().getTime();
    
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const addWorkUpdate = () => {
    if (!currentUpdate.trim()) {
      toast.error('Please enter work update');
      return;
    }

    const update = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      author: user.name,
      message: currentUpdate,
      type: 'progress_update'
    };

    setWorkUpdates(prev => [update, ...prev]);
    setCurrentUpdate('');
    toast.success('Work update added');
  };

  const handleWorkComplete = () => {
    if (window.confirm('Are you sure you want to mark this work as completed?')) {
      onWorkComplete({
        completedAt: new Date().toISOString(),
        completedBy: user.name,
        finalUpdates: workUpdates
      });
    }
  };

  const handleWorkStop = () => {
    const reason = prompt('Please provide reason for stopping work:');
    if (reason) {
      onWorkStop({
        stoppedAt: new Date().toISOString(),
        stoppedBy: user.name,
        reason: reason
      });
    }
  };

  const progress = calculateProgress();
  const isOvertime = progress > 100;

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>🏗️ Work Execution & Monitoring</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Real-time monitoring of work progress and safety compliance
        </p>
      </div>

      {/* Monitoring Dashboard */}
      <div style={monitoringGridStyles}>
        <div style={activeCardStyles}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>⏱️ Work Timer</h3>
          <div style={timerStyles}>{formatTime(elapsedTime)}</div>
          <div style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '14px' }}>
            Elapsed Time
          </div>
        </div>

        <div style={statusCardStyles}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📊 Work Progress</h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>
              {Math.round(progress)}%
            </div>
            <div style={progressBarStyles}>
              <div style={progressFillStyles(progress)}></div>
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
              {isOvertime ? 'Overtime' : 'In Progress'}
            </div>
          </div>
        </div>

        <div style={statusCardStyles}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>👥 Team Status</h3>
          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Team Members:</strong> {permit.teamMembers?.split('\n').length || 1}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Location:</strong> {permit.location}
            </div>
            <div>
              <strong>Supervisor:</strong> {user.name}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div style={progressSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📈 Progress Tracking</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Start Time</div>
            <div style={{ fontWeight: '600' }}>{new Date(permit.startDate).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Planned End</div>
            <div style={{ fontWeight: '600' }}>{new Date(permit.endDate).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Current Status</div>
            <div style={{ 
              fontWeight: '600', 
              color: workStatus === 'in_progress' ? '#3498db' : 
                     workStatus === 'completed' ? '#27ae60' : '#e74c3c'
            }}>
              {workStatus.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Safety Compliance</div>
            <div style={{ fontWeight: '600', color: '#27ae60' }}>✅ ACTIVE</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={progressBarStyles}>
          <div style={progressFillStyles(progress)}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7f8c8d' }}>
          <span>START</span>
          <span>{Math.round(progress)}% COMPLETE</span>
          <span>END</span>
        </div>
      </div>

      {/* Work Updates */}
      <div style={updateSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📝 Work Progress Updates</h3>
        
        <textarea
          value={currentUpdate}
          onChange={(e) => setCurrentUpdate(e.target.value)}
          style={textareaStyles}
          placeholder="Enter work progress update, safety observations, or any issues encountered..."
        />
        
        <div style={buttonGroupStyles}>
          <button 
            style={primaryButtonStyles}
            onClick={addWorkUpdate}
          >
            Add Progress Update
          </button>
        </div>

        {/* Updates List */}
        {workUpdates.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recent Updates</h4>
            {workUpdates.slice(0, 5).map(update => (
              <div key={update.id} style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '10px',
                borderLeft: '4px solid #3498db'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>{update.message}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                  By {update.author} at {new Date(update.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ ...buttonGroupStyles, marginTop: '30px' }}>
        <button 
          style={warningButtonStyles}
          onClick={handleWorkStop}
        >
          🛑 Stop Work
        </button>
        <button 
          style={{
            ...primaryButtonStyles,
            backgroundColor: '#27ae60'
          }}
          onClick={handleWorkComplete}
        >
          ✅ Complete Work
        </button>
      </div>
    </div>
  );
};

export default WorkExecutionMonitoring;