import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PermitProvider, usePermit } from './context/PermitContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import PermitsPage from './pages/PermitsPage';
import NewPermitPage from './pages/NewPermitPage';
import AdminPage from './pages/AdminPage';

// Import workflow steps
import Step1RequestPermit from './components/workflow/Step1RequestPermit';
import Step2VerifyChecklist from './components/workflow/Step2VerifyChecklist';
import Step3InspectWorkArea from './components/workflow/Step3InspectWorkArea';
import Step4ApprovePermit from './components/workflow/Step4ApprovePermit';
import Step5ExecuteWork from './components/workflow/Step5ExecuteWork';
import Step6ClosePermit from './components/workflow/Step6ClosePermit';
import Step7ArchiveReport from './components/workflow/Step7ArchiveReport';
import WorkflowController from './components/workflow/WorkflowController';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appStyles = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
};

const appContentStyles = {
  display: 'flex',
  minHeight: 'calc(100vh - 60px)'
};

const mainContentStyles = {
  flex: 1,
  padding: '20px',
  backgroundColor: '#f8f9fa',
  transition: 'margin-left 0.3s ease',
  overflowX: 'auto'
};

const loadingStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  gap: '20px'
};

const spinnerStyles = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Custom hook for route persistence
const useRoutePersistence = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Save current route to localStorage
  useEffect(() => {
    if (user && location.pathname !== '/login') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location, user]);

  // Get last saved route
  const getLastRoute = () => {
    if (!user) return '/';
    
    const lastRoute = localStorage.getItem('lastRoute');
    const roleBasedRoutes = {
      requester: '/workflow/step1',
      safety_officer: '/workflow/step2', 
      inspector: '/workflow/step3',
      approver: '/workflow/step4',
      admin: '/admin'
    };
    
    return lastRoute || roleBasedRoutes[user.role] || '/';
  };

  return { getLastRoute };
};

// Enhanced Protected Route Component with Role-based Access
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const { getLastRoute } = useRoutePersistence();
  
  if (loading) {
    return (
      <div style={loadingStyles}>
        <style>{keyframes}</style>
        <div style={spinnerStyles}></div>
        <div style={{ color: '#7f8c8d', fontSize: '16px' }}>Loading E-Permit System...</div>
      </div>
    );
  }
  
  if (!user) {
    // Save intended destination before redirecting to login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      localStorage.setItem('intendedDestination', currentPath);
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={getLastRoute()} replace />;
  }
  
  return children;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

// Wrapper components for workflow steps that handle the props
const Step1Wrapper = () => {
  const { createPermit } = usePermit();
  const navigate = useNavigate();

  const handleComplete = (permitData) => {
    // Set status to 'pending_checklist' so safety officer can see it
    const permitWithStatus = {
      ...permitData,
      status: 'pending_checklist',
      currentStep: 2,
      submittedAt: new Date().toISOString()
    };
    
    createPermit(permitWithStatus);
    toast.success('Permit request submitted! Sent to Safety Officer for verification.');
    navigate('/permits');
  };

  return <Step1RequestPermit onComplete={handleComplete} />;
};

const Step2Wrapper = () => {
  const { permits, updatePermit } = usePermit();
  const navigate = useNavigate();

  // Get ALL pending permits for safety officer (status: pending_checklist)
  const pendingPermits = permits.filter(p => p.status === 'pending_checklist');

  const handleComplete = (permitId, checklistData) => {
    if (permitId) {
      const permit = permits.find(p => p.id === permitId);
      updatePermit(permitId, {
        safetyChecklist: checklistData,
        status: 'pending_inspection',
        currentStep: 3,
        safetyApprovedAt: new Date().toISOString(),
        forwardedToRequester: true
      });
      toast.success('Safety checklist verified! Sent to Inspector and notified requester.');
      navigate('/permits');
    }
  };

  const handleReject = (permitId, reason) => {
    if (permitId) {
      updatePermit(permitId, {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString()
      });
      toast.error(`Checklist rejected: ${reason}`);
      navigate('/permits');
    }
  };

  if (pendingPermits.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>No Pending Checklists</h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '25px' }}>
          There are no permits waiting for safety checklist verification.
        </p>
        <div style={{
          backgroundColor: '#e8f4f8',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #3498db'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>What to expect:</h4>
          <ul style={{ textAlign: 'left', color: '#7f8c8d', lineHeight: '1.8' }}>
            <li>Requesters submit permits that need safety verification</li>
            <li>New permits will appear here automatically</li>
            <li>You can verify safety checklists and upload photo evidence</li>
            <li>Approved permits move to inspection phase</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #ffeaa7'
      }}>
        <h3 style={{ color: '#856404', marginBottom: '10px' }}>
          📋 Pending Checklist Verifications ({pendingPermits.length})
        </h3>
        <p style={{ color: '#856404', margin: 0 }}>
          You have {pendingPermits.length} permit(s) waiting for safety checklist verification.
        </p>
      </div>

      {pendingPermits.map((permit, index) => (
        <div key={permit.id} style={{ marginBottom: index < pendingPermits.length - 1 ? '30px' : '0' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>
              Permit: {permit.permitNumber || `PER-${permit.id}`}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
              <div><strong>Work Area:</strong> {permit.workArea}</div>
              <div><strong>Location:</strong> {permit.location}</div>
              <div><strong>Requester:</strong> {permit.requester}</div>
              <div><strong>Submitted:</strong> {new Date(permit.submittedAt).toLocaleDateString()}</div>
            </div>
          </div>
          <Step2VerifyChecklist 
            permit={permit}
            onComplete={(data) => handleComplete(permit.id, data)}
            onReject={(reason) => handleReject(permit.id, reason)}
          />
        </div>
      ))}
    </div>
  );
};

const Step3Wrapper = () => {
  const { permits, updatePermit } = usePermit();
  const navigate = useNavigate();

  const pendingInspection = permits.filter(p => p.status === 'pending_inspection');

  const handleApprove = (permitId, inspectionData) => {
    if (permitId) {
      updatePermit(permitId, {
        inspection: inspectionData,
        status: 'pending_approval',
        currentStep: 4
      });
      toast.success('Inspection completed! Sent for approval.');
      navigate('/permits');
    }
  };

  const handleReject = (permitId, inspectionData) => {
    if (permitId) {
      updatePermit(permitId, {
        inspection: inspectionData,
        status: 'rejected'
      });
      toast.error('Inspection failed: Work area not compliant');
      navigate('/permits');
    }
  };

  if (pendingInspection.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#6c757d', marginBottom: '20px' }}>No Permits Pending Inspection</h2>
        <p style={{ color: '#6c757d', fontSize: '16px' }}>
          There are currently no permits that have been approved by the Safety Officer and are ready for inspection.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', textAlign: 'center' }}>
        🔍 Permits Pending Inspection
      </h2>
      
      <div style={{
        backgroundColor: '#e8f4fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #bee5eb'
      }}>
        <p style={{ color: '#0c5460', margin: '0', fontSize: '16px' }}>
          <strong>{pendingInspection.length}</strong> permit(s) have been approved by the Safety Officer and are ready for inspection.
          Click on any permit to start the inspection process.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {pendingInspection.map(permit => (
          <div key={permit.id} style={{
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          onClick={() => navigate(`/workflow/step3/${permit.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#2c3e50', margin: '0', fontSize: '18px' }}>
                {permit.permitNumber}
              </h3>
              <span style={{
                backgroundColor: '#ffc107',
                color: '#856404',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Pending Inspection
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ color: '#495057', margin: '0 0 5px 0', fontSize: '16px' }}>
                {permit.title}
              </h4>
              <p style={{ color: '#6c757d', margin: '0', fontSize: '14px' }}>
                {permit.workDescription}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div>
                <strong style={{ color: '#495057' }}>Work Area:</strong>
                <div style={{ color: '#6c757d' }}>{permit.workArea}</div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Location:</strong>
                <div style={{ color: '#6c757d' }}>{permit.location}</div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Requester:</strong>
                <div style={{ color: '#6c757d' }}>{permit.requester}</div>
              </div>
              <div>
                <strong style={{ color: '#495057' }}>Safety Approved:</strong>
                <div style={{ color: '#28a745' }}>
                  {permit.safetyApprovedAt ? new Date(permit.safetyApprovedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <button style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Start Inspection →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step4Wrapper = () => {
  const { permits, updatePermit } = usePermit();
  const navigate = useNavigate();

  const pendingApproval = permits.filter(p => p.status === 'pending_approval');

  const handleApprove = (permitId, approvalData) => {
    if (permitId) {
      updatePermit(permitId, {
        approval: approvalData,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        currentStep: 5
      });
      toast.success('Permit approved! Work can now commence.');
      navigate('/permits');
    }
  };

  const handleReject = (permitId, approvalData) => {
    if (permitId) {
      updatePermit(permitId, {
        approval: approvalData,
        status: 'rejected'
      });
      toast.error('Permit rejected');
      navigate('/permits');
    }
  };

  if (pendingApproval.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
        <h3>No Pending Approvals</h3>
        <p>There are no permits waiting for final approval.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#f0f9f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #27ae60'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          ✅ Pending Approvals ({pendingApproval.length})
        </h3>
        <p style={{ color: '#2c3e50', margin: 0 }}>
          You have {pendingApproval.length} permit(s) waiting for final approval.
        </p>
      </div>

      {pendingApproval.map((permit, index) => (
        <div key={permit.id} style={{ marginBottom: index < pendingApproval.length - 1 ? '30px' : '0' }}>
          <Step4ApprovePermit 
            permit={permit}
            onApprove={(data) => handleApprove(permit.id, data)}
            onReject={(data) => handleReject(permit.id, data)}
          />
        </div>
      ))}
    </div>
  );
};

const Step5Wrapper = () => {
  const { permits, updatePermit } = usePermit();
  const navigate = useNavigate();

  const activeWork = permits.filter(p => p.status === 'approved');

  const handleWorkComplete = (permitId, completionData) => {
    if (permitId) {
      updatePermit(permitId, {
        workCompletion: completionData,
        status: 'pending_closure',
        currentStep: 6
      });
      toast.success('Work completed successfully! Ready for closure.');
      navigate('/permits');
    }
  };

  const handleWorkStop = (permitId, stopData) => {
    if (permitId) {
      updatePermit(permitId, {
        workStopped: stopData,
        status: 'stopped'
      });
      toast.error(`Work stopped: ${stopData.reason}`);
      navigate('/permits');
    }
  };

  if (activeWork.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛠️</div>
        <h3>No Active Work</h3>
        <p>There are no approved permits with active work to execute.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #ffeaa7'
      }}>
        <h3 style={{ color: '#856404', marginBottom: '10px' }}>
          🛠️ Active Work Permits ({activeWork.length})
        </h3>
        <p style={{ color: '#856404', margin: 0 }}>
          You have {activeWork.length} approved permit(s) ready for work execution.
        </p>
      </div>

      {activeWork.map((permit, index) => (
        <div key={permit.id} style={{ marginBottom: index < activeWork.length - 1 ? '30px' : '0' }}>
          <Step5ExecuteWork 
            permit={permit}
            onWorkComplete={(data) => handleWorkComplete(permit.id, data)}
            onWorkStop={(data) => handleWorkStop(permit.id, data)}
          />
        </div>
      ))}
    </div>
  );
};

const Step6Wrapper = () => {
  const { permits, updatePermit } = usePermit();
  const navigate = useNavigate();

  const pendingClosure = permits.filter(p => p.status === 'pending_closure');

  const handleClosureComplete = (permitId, closureData) => {
    if (permitId) {
      updatePermit(permitId, {
        closure: closureData,
        status: 'closed',
        closedAt: new Date().toISOString(),
        currentStep: 7
      });
      toast.success('Permit closed successfully! Archived in system.');
      navigate('/permits');
    }
  };

  if (pendingClosure.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
        <h3>No Pending Closures</h3>
        <p>There are no permits waiting for closure.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#e8f4f8',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #3498db'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          🔒 Pending Closures ({pendingClosure.length})
        </h3>
        <p style={{ color: '#2c3e50', margin: 0 }}>
          You have {pendingClosure.length} permit(s) waiting for closure.
        </p>
      </div>

      {pendingClosure.map((permit, index) => (
        <div key={permit.id} style={{ marginBottom: index < pendingClosure.length - 1 ? '30px' : '0' }}>
          <Step6ClosePermit 
            permit={permit}
            onClosureComplete={(data) => handleClosureComplete(permit.id, data)}
          />
        </div>
      ))}
    </div>
  );
};

const Step7Wrapper = () => {
  const { permits } = usePermit();

  const closedPermits = permits.filter(p => p.status === 'closed');

  if (closedPermits.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
        <h3>No Archived Permits</h3>
        <p>There are no closed permits available for archiving and reporting.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#f0f9f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: '1px solid #27ae60'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          📊 Archived Permits ({closedPermits.length})
        </h3>
        <p style={{ color: '#2c3e50', margin: 0 }}>
          You have {closedPermits.length} closed permit(s) available for reporting.
        </p>
      </div>

      {closedPermits.map((permit, index) => (
        <div key={permit.id} style={{ marginBottom: index < closedPermits.length - 1 ? '30px' : '0' }}>
          <Step7ArchiveReport permit={permit} />
        </div>
      ))}
    </div>
  );
};

// Role-based Home Component with route persistence
const RoleBasedHome = () => {
  const { user } = useAuth();
  const { permits, fetchPermits } = usePermit();
  const { getLastRoute } = useRoutePersistence();
  const navigate = useNavigate();

  // Redirect to last route or role-specific page
  useEffect(() => {
    const lastRoute = getLastRoute();
    if (lastRoute !== '/') {
      navigate(lastRoute);
    }
  }, [user, navigate]);

  const getRoleWorkflowSteps = () => {
    const steps = {
      requester: [
        { step: 1, title: 'New Permit', description: 'Create new safety permit requests', path: '/workflow/step1' }, // Changed from 'Request Permit' to 'New Permit'
        { step: 5, title: 'Execute Work', description: 'Monitor and execute approved work', path: '/workflow/step5' }
      ],
      safety_officer: [
        { step: 2, title: 'Verify Checklist', description: 'Review and verify safety checklists', path: '/workflow/step2' },
        { step: 6, title: 'Close Permit', description: 'Finalize and close completed permits', path: '/workflow/step6' }
      ],
      inspector: [
        { step: 3, title: 'Inspect Work Area', description: 'Conduct physical site inspections', path: '/workflow/step3' }
      ],
      approver: [
        { step: 4, title: 'Approve Permit', description: 'Final approval and digital signing', path: '/workflow/step4' }
      ],
      admin: [
        { step: 7, title: 'Archive & Report', description: 'System analytics and reporting', path: '/workflow/step7' },
        { step: 'all', title: 'Full Workflow', description: 'Complete workflow oversight', path: '/workflow' }
      ]
    };
    return steps[user.role] || [];
  };

  const getPendingCounts = () => {
    const counts = {
      requester: {
        pending: permits.filter(p => p.requesterId === user.id && p.status === 'pending_checklist').length,
        safetyApproved: permits.filter(p => p.requesterId === user.id && p.status === 'pending_inspection' && p.forwardedToRequester).length,
        approved: permits.filter(p => p.requesterId === user.id && p.status === 'approved').length,
        total: permits.filter(p => p.requesterId === user.id).length
      },
      safety_officer: {
        pending: permits.filter(p => p.status === 'pending_checklist').length,
        closure: permits.filter(p => p.status === 'pending_closure').length,
        total: permits.filter(p => p.status === 'pending_checklist' || p.status === 'pending_closure').length
      },
      inspector: {
        pending: permits.filter(p => p.status === 'pending_inspection').length,
        total: permits.filter(p => p.status === 'pending_inspection').length
      },
      approver: {
        pending: permits.filter(p => p.status === 'pending_approval').length,
        total: permits.filter(p => p.status === 'pending_approval').length
      },
      admin: {
        closed: permits.filter(p => p.status === 'closed').length,
        total: permits.length
      }
    };
    return counts[user.role] || {};
  };

  const workflowSteps = getRoleWorkflowSteps();
  const pendingCounts = getPendingCounts();

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>Welcome back, {user.name}!</h1>
        <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
          Role: <strong>{user.role.replace('_', ' ')}</strong>
        </p>
      </div>

      {/* Quick Stats */}
      {Object.keys(pendingCounts).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {pendingCounts.pending !== undefined && (
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>{pendingCounts.pending}</div>
              <div style={{ color: '#856404', fontSize: '14px' }}>Pending Tasks</div>
            </div>
          )}
          {pendingCounts.safetyApproved !== undefined && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #2196f3'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{pendingCounts.safetyApproved}</div>
              <div style={{ color: '#0d47a1', fontSize: '14px' }}>Safety Approved</div>
            </div>
          )}
          {pendingCounts.approved !== undefined && (
            <div style={{
              backgroundColor: '#d5f4e6',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #27ae60'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{pendingCounts.approved}</div>
              <div style={{ color: '#155724', fontSize: '14px' }}>Approved</div>
            </div>
          )}
          {pendingCounts.closure !== undefined && (
            <div style={{
              backgroundColor: '#e8f4f8',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #3498db'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{pendingCounts.closure}</div>
              <div style={{ color: '#2c3e50', fontSize: '14px' }}>For Closure</div>
            </div>
          )}
          {pendingCounts.closed !== undefined && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #6c757d'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>{pendingCounts.closed}</div>
              <div style={{ color: '#495057', fontSize: '14px' }}>Archived</div>
            </div>
          )}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{pendingCounts.total}</div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Total</div>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Your Workflow Responsibilities</h2>
        
        {workflowSteps.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {workflowSteps.map((step) => (
              <div 
                key={step.step}
                style={{
                  padding: '25px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px solid #3498db',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => window.location.href = step.path}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ color: '#2c3e50', margin: 0 }}>{step.title}</h3>
                </div>
                <p style={{ color: '#7f8c8d', margin: 0, lineHeight: '1.5' }}>
                  {step.description}
                </p>
                <div style={{ 
                  marginTop: '15px', 
                  color: '#3498db', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Click to access →
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
            <h3 style={{ color: '#7f8c8d' }}>No Workflow Access</h3>
            <p>Your role doesn't have direct workflow responsibilities.</p>
          </div>
        )}
      </div>

      {/* Safety Approved Tasks Section - Only for Requesters */}
      {user?.role === 'requester' && pendingCounts.safetyApproved > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#1976d2', marginBottom: '25px' }}>🛡️ Safety Approved Tasks</h2>
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #2196f3',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#0d47a1', margin: '0' }}>
              <strong>{pendingCounts.safetyApproved}</strong> of your permits have been approved by the Safety Officer and are now under inspection.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {permits
              .filter(p => p.requesterId === user.id && p.status === 'pending_inspection' && p.forwardedToRequester)
              .map(permit => (
                <div key={permit.id} style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  borderLeft: '4px solid #2196f3'
                }}>
                  <h4 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>{permit.title}</h4>
                  <p style={{ color: '#6c757d', margin: '0 0 10px 0', fontSize: '14px' }}>
                    {permit.workArea} • {permit.workType}
                  </p>
                  <div style={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2', 
                    padding: '5px 10px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    display: 'inline-block',
                    fontWeight: '600'
                  }}>
                    Safety Approved • Under Inspection
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Layout Component
const AppLayout = () => {
  const { user } = useAuth();
  
  return (
    <div style={appStyles}>
      <Header />
      <div style={appContentStyles}>
        {user && <Sidebar />}
        <div style={{ 
          ...mainContentStyles, 
          marginLeft: user ? '250px' : '0' 
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            
            {/* Protected Routes - Role-based Home */}
            <Route path="/" element={<ProtectedRoute><RoleBasedHome /></ProtectedRoute>} />
            
            {/* Dashboard - All Roles */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            
            {/* Permits Management - All Roles */}
            <Route path="/permits" element={<ProtectedRoute><PermitsPage /></ProtectedRoute>} />
            
            {/* New Permit - Requesters Only */}
            <Route path="/new-permit" element={
              <ProtectedRoute requiredRoles={['requester']}>
                <NewPermitPage />
              </ProtectedRoute>
            } />
            
            {/* Workflow Steps - Role Specific with Proper Props */}
            
            {/* Step 1: New Permit - Requester Only */}
            <Route path="/workflow/step1" element={
              <ProtectedRoute requiredRoles={['requester']}>
                <Step1Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 2: Verify Checklist - Safety Officer Only */}
            <Route path="/workflow/step2" element={
              <ProtectedRoute requiredRoles={['safety_officer']}>
                <Step2Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 3: Inspect Work Area - Inspector Only */}
            <Route path="/workflow/step3" element={
              <ProtectedRoute requiredRoles={['inspector']}>
                <Step3Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 3: Individual Permit Inspection - Inspector Only */}
            <Route path="/workflow/step3/:permitId" element={
              <ProtectedRoute requiredRoles={['inspector']}>
                <Step3InspectWorkArea />
              </ProtectedRoute>
            } />
            
            {/* Step 4: Approve Permit - Approver Only */}
            <Route path="/workflow/step4" element={
              <ProtectedRoute requiredRoles={['approver']}>
                <Step4Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 5: Execute Work - Requester Only */}
            <Route path="/workflow/step5" element={
              <ProtectedRoute requiredRoles={['requester']}>
                <Step5Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 6: Close Permit - Safety Officer Only */}
            <Route path="/workflow/step6" element={
              <ProtectedRoute requiredRoles={['safety_officer']}>
                <Step6Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Step 7: Archive & Report - Admin Only */}
            <Route path="/workflow/step7" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Step7Wrapper />
              </ProtectedRoute>
            } />
            
            {/* Complete Workflow Controller - Admin Only */}
            <Route path="/workflow" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <WorkflowController />
              </ProtectedRoute>
            } />
            
            {/* Admin Panel - Admins Only */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } />
            
{/* Fallback Routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <PermitProvider>
        <AppLayout />
      </PermitProvider>
    </AuthProvider>
  );
}

export default App;