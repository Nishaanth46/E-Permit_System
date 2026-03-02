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
  borderBottom: '2px solid #3498db'
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

const permitCardStyles = {
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '2px solid #3498db'
};

const monitoringGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const monitorCardStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  textAlign: 'center'
};

const timerStyles = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '15px 0'
};

const progressSectionStyles = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #e9ecef'
};

const progressBarStyles = {
  height: '12px',
  backgroundColor: '#ecf0f1',
  borderRadius: '6px',
  overflow: 'hidden',
  margin: '15px 0'
};

const progressFillStyles = (percentage) => ({
  height: '100%',
  width: `${percentage}%`,
  backgroundColor: percentage < 50 ? '#e74c3c' : percentage < 80 ? '#f39c12' : '#27ae60',
  borderRadius: '6px',
  transition: 'width 0.5s ease'
});

const updateSectionStyles = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px',
  border: '1px solid #ffeaa7'
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

const warningButtonStyles = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const Step5ExecuteWork = ({ permit, onWorkComplete, onWorkStop }) => {
  const { user } = useAuth();
  const [workStatus, setWorkStatus] = useState('in_progress');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workUpdates, setWorkUpdates] = useState([]);
  const [currentUpdate, setCurrentUpdate] = useState('');
  const [safetyChecks, setSafetyChecks] = useState({
    ppeCompliant: true,
    areaSecure: true,
    equipmentSafe: true,
    emergencyAccess: true
  });

  useEffect(() => {
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

  const handleSafetyCheckChange = (check, value) => {
    setSafetyChecks(prev => ({
      ...prev,
      [check]: value
    }));
  };

  const handleWorkComplete = () => {
    const allSafetyChecks = Object.values(safetyChecks).every(check => check);
    
    if (!allSafetyChecks) {
      toast.error('All safety checks must be compliant before completing work');
      return;
    }

    if (workUpdates.length === 0) {
      toast.error('Please add at least one work progress update');
      return;
    }

    const completionData = {
      completedAt: new Date().toISOString(),
      completedBy: user.name,
      finalProgress: calculateProgress(),
      totalDuration: formatTime(elapsedTime),
      workUpdates: workUpdates,
      safetyChecks: safetyChecks,
      status: 'completed'
    };

    onWorkComplete(completionData);
    toast.success('Work marked as completed!');
  };

  const handleWorkStop = () => {
    const reason = prompt('Please provide reason for stopping work:');
    if (reason) {
      onWorkStop({
        stoppedAt: new Date().toISOString(),
        stoppedBy: user.name,
        reason: reason,
        elapsedTime: formatTime(elapsedTime)
      });
    }
  };

  const progress = calculateProgress();
  const isOvertime = progress > 100;

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          <span style={{ backgroundColor: '#3498db', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>5</span>
          Execute Work - Requester
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Monitor work progress and maintain safety compliance
        </p>
      </div>

      {/* Active Permit Card */}
      <div style={permitCardStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', margin: '0 0 5px 0' }}>Active Safety Permit</h3>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>
              {permit.permitNumber}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>Work Area</div>
            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{permit.workArea}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px' }}>
          <div><strong>Location:</strong> {permit.location}</div>
          <div><strong>Supervisor:</strong> {user.name}</div>
          <div><strong>Team Size:</strong> {permit.teamMembers?.split('\n').length || 1}</div>
          <div><strong>Status:</strong> <span style={{ color: '#3498db', fontWeight: 'bold' }}>ACTIVE</span></div>
        </div>
      </div>

      {/* Real-time Monitoring */}
      <div style={monitoringGridStyles}>
        <div style={monitorCardStyles}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>⏱️ Work Timer</h4>
          <div style={timerStyles}>{formatTime(elapsedTime)}</div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Elapsed Time</div>
        </div>

        <div style={monitorCardStyles}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>📊 Work Progress</h4>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
            {Math.round(progress)}%
          </div>
          <div style={progressBarStyles}>
            <div style={progressFillStyles(progress)}></div>
          </div>
          <div style={{ color: isOvertime ? '#e74c3c' : '#7f8c8d', fontSize: '12px', fontWeight: isOvertime ? 'bold' : 'normal' }}>
            {isOvertime ? 'OVERTIME' : 'IN PROGRESS'}
          </div>
        </div>

        <div style={monitorCardStyles}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>👥 Team Status</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>
            {permit.teamMembers?.split('\n').length || 1}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Team Members</div>
          <div style={{ fontSize: '12px', color: '#27ae60', marginTop: '8px' }}>
            ✅ All Present
          </div>
        </div>

        <div style={monitorCardStyles}>
          <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>🛡️ Safety Status</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60', marginBottom: '5px' }}>
            ACTIVE
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Compliance</div>
          <div style={{ fontSize: '12px', color: '#27ae60', marginTop: '8px' }}>
            🟢 All Systems Go
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div style={progressSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Progress Tracking</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px', fontSize: '14px' }}>
          <div>
            <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Start Time</div>
            <div style={{ fontWeight: '600' }}>{new Date(permit.startDate).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Planned End</div>
            <div style={{ fontWeight: '600' }}>{new Date(permit.endDate).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Current Progress</div>
            <div style={{ fontWeight: '600', color: '#3498db' }}>{Math.round(progress)}% Complete</div>
          </div>
          <div>
            <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Time Remaining</div>
            <div style={{ fontWeight: '600', color: isOvertime ? '#e74c3c' : '#27ae60' }}>
              {isOvertime ? 'OVERTIME' : 'IN PROGRESS'}
            </div>
          </div>
        </div>

        <div style={progressBarStyles}>
          <div style={progressFillStyles(progress)}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7f8c8d' }}>
          <span>START</span>
          <span>{Math.round(progress)}% COMPLETE</span>
          <span>END</span>
        </div>
      </div>

      {/* Safety Compliance Checks */}
      <div style={{ ...progressSectionStyles, backgroundColor: '#f0f9f0', borderColor: '#27ae60' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>🛡️ Safety Compliance Checks</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.ppeCompliant}
              onChange={(e) => handleSafetyCheckChange('ppeCompliant', e.target.checked)}
            />
            <span style={{ color: safetyChecks.ppeCompliant ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
              {safetyChecks.ppeCompliant ? '✅' : '❌'} PPE Compliant
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.areaSecure}
              onChange={(e) => handleSafetyCheckChange('areaSecure', e.target.checked)}
            />
            <span style={{ color: safetyChecks.areaSecure ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
              {safetyChecks.areaSecure ? '✅' : '❌'} Area Secure
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.equipmentSafe}
              onChange={(e) => handleSafetyCheckChange('equipmentSafe', e.target.checked)}
            />
            <span style={{ color: safetyChecks.equipmentSafe ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
              {safetyChecks.equipmentSafe ? '✅' : '❌'} Equipment Safe
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.emergencyAccess}
              onChange={(e) => handleSafetyCheckChange('emergencyAccess', e.target.checked)}
            />
            <span style={{ color: safetyChecks.emergencyAccess ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
              {safetyChecks.emergencyAccess ? '✅' : '❌'} Emergency Access
            </span>
          </label>
        </div>
      </div>

      {/* Work Updates */}
      <div style={updateSectionStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📝 Work Progress Updates</h3>
        
        <textarea
          value={currentUpdate}
          onChange={(e) => setCurrentUpdate(e.target.value)}
          style={textareaStyles}
          placeholder="Enter work progress update, safety observations, issues encountered, or milestones achieved..."
        />
        
        <div style={buttonGroupStyles}>
          <button 
            style={{ ...primaryButtonStyles, backgroundColor: '#3498db' }}
            onClick={addWorkUpdate}
          >
            ➕ Add Progress Update
          </button>
        </div>

        {/* Recent Updates */}
        {workUpdates.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recent Updates ({workUpdates.length})</h4>
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
          style={primaryButtonStyles}
          onClick={handleWorkComplete}
          disabled={!Object.values(safetyChecks).every(check => check) || workUpdates.length === 0}
        >
          ✅ Complete Work
        </button>
      </div>
    </div>
  );
};

export default Step5ExecuteWork;