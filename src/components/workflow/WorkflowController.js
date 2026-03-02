import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermit } from '../../context/PermitContext';
import Step1RequestPermit from './Step1RequestPermit';
import Step2VerifyChecklist from './Step2VerifyChecklist';
import Step3InspectWorkArea from './Step3InspectWorkArea';
import Step4ApprovePermit from './Step4ApprovePermit';
import Step5ExecuteWork from './Step5ExecuteWork';
import Step6ClosePermit from './Step6ClosePermit';
import Step7ArchiveReport from './Step7ArchiveReport';
import { toast } from 'react-toastify';

const workflowSteps = [
  { id: 1, name: 'Request Permit', role: 'requester', component: 'step1' },
  { id: 2, name: 'Verify Checklist', role: 'safety_officer', component: 'step2' },
  { id: 3, name: 'Inspect Work Area', role: 'inspector', component: 'step3' },
  { id: 4, name: 'Approve Permit', role: 'approver', component: 'step4' },
  { id: 5, name: 'Execute Work', role: 'requester', component: 'step5' },
  { id: 6, name: 'Close Permit', role: 'safety_officer', component: 'step6' },
  { id: 7, name: 'Archive & Report', role: 'system', component: 'step7' }
];

const WorkflowController = () => {
  const { user } = useAuth();
  const { createPermit, updatePermit } = usePermit();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPermit, setCurrentPermit] = useState(null);
  const [workflowData, setWorkflowData] = useState({});

  // Filter workflow steps based on user role
  const getFilteredWorkflowSteps = () => {
    if (user?.role === 'requester') {
      return workflowSteps.filter(step => step.role === 'requester');
    }
    return workflowSteps;
  };

  const filteredWorkflowSteps = getFilteredWorkflowSteps();

  // Handle Step 1: Request Permit
  const handleStep1Complete = (permitRequest) => {
    const newPermit = {
      ...permitRequest,
      id: Date.now(),
      permitNumber: `PER-${Date.now()}`,
      status: 'pending_checklist',
      createdAt: new Date().toISOString()
    };

    setCurrentPermit(newPermit);
    setWorkflowData(prev => ({ ...prev, step1: permitRequest }));
    setCurrentStep(2);
    toast.success('Permit request submitted to Safety Officer');
  };

  // Handle Step 2: Verify Checklist
  const handleStep2Complete = (checklistData) => {
    const updatedPermit = {
      ...currentPermit,
      safetyChecklist: checklistData,
      status: 'pending_inspection'
    };

    setCurrentPermit(updatedPermit);
    setWorkflowData(prev => ({ ...prev, step2: checklistData }));
    setCurrentStep(3);
    toast.success('Safety checklist verified! Sent for inspection.');
  };

  // Handle Step 3: Inspect Work Area
  const handleStep3Complete = (inspectionData) => {
    const updatedPermit = {
      ...currentPermit,
      inspection: inspectionData,
      status: 'pending_approval'
    };

    setCurrentPermit(updatedPermit);
    setWorkflowData(prev => ({ ...prev, step3: inspectionData }));
    setCurrentStep(4);
    toast.success('Inspection completed! Sent for management approval.');
  };

  // Handle Step 4: Approve Permit
  const handleStep4Complete = (approvalData) => {
    const updatedPermit = {
      ...currentPermit,
      approval: approvalData,
      status: 'approved',
      approvedAt: new Date().toISOString()
    };

    // Save to context
    createPermit(updatedPermit);
    
    setCurrentPermit(updatedPermit);
    setWorkflowData(prev => ({ ...prev, step4: approvalData }));
    setCurrentStep(5);
    toast.success('Permit approved! Work can now commence.');
  };

  // Handle Step 5: Execute Work
  const handleStep5Complete = (workCompletion) => {
    const updatedPermit = {
      ...currentPermit,
      workCompletion: workCompletion,
      status: 'pending_closure'
    };

    updatePermit(currentPermit.id, updatedPermit);
    setCurrentPermit(updatedPermit);
    setWorkflowData(prev => ({ ...prev, step5: workCompletion }));
    setCurrentStep(6);
    toast.success('Work completed! Ready for closure verification.');
  };

  // Handle Step 6: Close Permit
  const handleStep6Complete = (closureData) => {
    const updatedPermit = {
      ...currentPermit,
      closure: closureData,
      status: 'closed',
      closedAt: new Date().toISOString()
    };

    updatePermit(currentPermit.id, updatedPermit);
    setCurrentPermit(updatedPermit);
    setWorkflowData(prev => ({ ...prev, step6: closureData }));
    setCurrentStep(7);
    toast.success('Permit closed successfully! Archived in system.');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1RequestPermit onComplete={handleStep1Complete} />;
      
      case 2:
        return (
          <Step2VerifyChecklist
            permit={currentPermit}
            onComplete={handleStep2Complete}
            onReject={(reason) => {
              toast.error(`Checklist rejected: ${reason}`);
              setCurrentStep(1);
            }}
          />
        );
      
      case 3:
        return (
          <Step3InspectWorkArea
            permit={currentPermit}
            onApprove={handleStep3Complete}
            onReject={(data) => {
              toast.error('Inspection failed: Work area not compliant');
              setCurrentStep(2);
            }}
          />
        );
      
      case 4:
        return (
          <Step4ApprovePermit
            permit={currentPermit}
            onApprove={handleStep4Complete}
            onReject={(data) => {
              toast.error('Permit rejected by management');
              setCurrentStep(1);
            }}
          />
        );
      
      case 5:
        return (
          <Step5ExecuteWork
            permit={currentPermit}
            onWorkComplete={handleStep5Complete}
            onWorkStop={(data) => {
              toast.error(`Work stopped: ${data.reason}`);
            }}
          />
        );
      
      case 6:
        return (
          <Step6ClosePermit
            permit={currentPermit}
            onClosureComplete={handleStep6Complete}
          />
        );
      
      case 7:
        return <Step7ArchiveReport permit={currentPermit} />;
      
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div>
      {/* Workflow Progress Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#2c3e50', textAlign: 'center' }}>
          Safety Permit Workflow
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          {filteredWorkflowSteps.map((step, index) => (
            <div key={step.id} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
              {/* Connection Line */}
              {index < filteredWorkflowSteps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '60%',
                  right: '-40%',
                  height: '2px',
                  backgroundColor: currentStep > step.id ? '#3498db' : '#ecf0f1',
                  zIndex: 1
                }}></div>
              )}
              
              {/* Step Circle */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step.id ? '#3498db' : '#ecf0f1',
                color: currentStep >= step.id ? 'white' : '#bdc3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                margin: '0 auto 8px auto',
                position: 'relative',
                zIndex: 2,
                fontSize: '14px'
              }}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              
              {/* Step Label */}
              <div style={{
                fontSize: '12px',
                fontWeight: currentStep === step.id ? 'bold' : 'normal',
                color: currentStep >= step.id ? '#3498db' : '#bdc3c7'
              }}>
                {step.name}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#7f8c8d',
                marginTop: '4px'
              }}>
                {step.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
};

export default WorkflowController;