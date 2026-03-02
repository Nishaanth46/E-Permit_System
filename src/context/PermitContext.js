import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const PermitContext = createContext();

export const usePermit = () => {
  const context = useContext(PermitContext);
  if (!context) {
    throw new Error('usePermit must be used within a PermitProvider');
  }
  return context;
};

export const PermitProvider = ({ children }) => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workAreas, setWorkAreas] = useState([]);

  // Load data from localStorage on startup
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    loadPermitsFromStorage();
    loadWorkAreas();
  };

  const loadPermitsFromStorage = () => {
    try {
      const savedPermits = localStorage.getItem('permits');
      if (savedPermits) {
        setPermits(JSON.parse(savedPermits));
      } else {
        // Load initial demo data
        const demoPermits = [
          {
            id: 1,
            permitNumber: 'PER-2024-001',
            workArea: 'ELECTRICAL',
            workType: 'Electrical Panel Maintenance',
            location: 'Building A, Floor 2, Electrical Room',
            workDescription: 'Routine maintenance and inspection of main electrical panel',
            requester: 'John Requester',
            requesterId: 1,
            department: 'Operations',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 172800000).toISOString(),
            teamMembers: 'John Requester (Supervisor)\nMike Electrician (Technician)',
            safetyMeasures: 'Lockout-tagout procedures\nInsulated tools\nSafety barriers',
            equipmentUsed: 'Multimeter, Insulated tools, Voltage tester',
            emergencyContacts: 'Safety Officer: 555-0123\nSite Supervisor: 555-0124',
            status: 'pending_checklist',
            submittedAt: new Date().toISOString(),
            currentStep: 2
          },
          {
            id: 2,
            permitNumber: 'PER-2024-002',
            workArea: 'MACHINE',
            workType: 'Conveyor Belt Repair',
            location: 'Production Line 1, Section B',
            workDescription: 'Repair and maintenance of main conveyor belt system',
            requester: 'Jane Smith',
            requesterId: 2,
            department: 'Maintenance',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000).toISOString(),
            teamMembers: 'Jane Smith (Supervisor)\nBob Technician (Mechanic)',
            safetyMeasures: 'Machine lockout\nPersonal protective equipment\nArea barricades',
            equipmentUsed: 'Wrench set, Power tools, Safety glasses',
            emergencyContacts: 'Safety Officer: 555-0123\nMaintenance Lead: 555-0125',
            status: 'pending_inspection',
            submittedAt: new Date(Date.now() - 3600000).toISOString(),
            currentStep: 3,
            safetyApprovedAt: new Date(Date.now() - 1800000).toISOString(),
            forwardedToRequester: true,
            safetyChecklist: {
              verified: true,
              verifiedAt: new Date(Date.now() - 1800000).toISOString(),
              verifiedBy: 'Sarah Safety',
              items: [
                { id: 1, item: 'Work area properly barricaded', status: 'compliant' },
                { id: 2, item: 'Safety equipment available', status: 'compliant' },
                { id: 3, item: 'Emergency exits clear', status: 'compliant' }
              ]
            }
          },
          {
            id: 3,
            permitNumber: 'PER-2024-003',
            workArea: 'CONFINED_SPACE',
            workType: 'Tank Inspection',
            location: 'Storage Tank Area, Tank #3',
            workDescription: 'Internal inspection and cleaning of storage tank',
            requester: 'Mike Johnson',
            requesterId: 3,
            department: 'Quality Control',
            startDate: new Date(Date.now() + 7200000).toISOString(),
            endDate: new Date(Date.now() + 28800000).toISOString(),
            teamMembers: 'Mike Johnson (Supervisor)\nTom Inspector\nSam Technician',
            safetyMeasures: 'Gas monitoring system\nVentilation equipment\nRescue team standby',
            equipmentUsed: 'Gas detector, Ventilation fans, Safety harness',
            emergencyContacts: 'Safety Officer: 555-0123\nRescue Team: 555-0126',
            status: 'pending_inspection',
            submittedAt: new Date(Date.now() - 7200000).toISOString(),
            currentStep: 3,
            safetyApprovedAt: new Date(Date.now() - 3600000).toISOString(),
            forwardedToRequester: true,
            safetyChecklist: {
              verified: true,
              verifiedAt: new Date(Date.now() - 3600000).toISOString(),
              verifiedBy: 'Sarah Safety',
              items: [
                { id: 1, item: 'Atmosphere tested and safe', status: 'compliant' },
                { id: 2, item: 'Ventilation equipment ready', status: 'compliant' },
                { id: 3, item: 'Rescue team on standby', status: 'compliant' }
              ]
            }
          }
        ];
        setPermits(demoPermits);
        savePermitsToStorage(demoPermits);
      }
    } catch (error) {
      console.error('Failed to load permits from storage:', error);
    }
  };

  const loadWorkAreas = () => {
    const defaultWorkAreas = [
      { id: 1, code: 'ELECTRICAL', name: 'Electrical Work', riskLevel: 'High', icon: '⚡' },
      { id: 2, code: 'MECHANICAL', name: 'Mechanical Work', riskLevel: 'Medium', icon: '🔧' },
      { id: 3, code: 'HEIGHT', name: 'Working at Height', riskLevel: 'High', icon: '🪜' },
      { id: 4, code: 'CONFINED', name: 'Confined Space', riskLevel: 'High', icon: '🚪' },
      { id: 5, code: 'HOTWORK', name: 'Hot Work', riskLevel: 'High', icon: '🔥' },
      { id: 6, code: 'EXCAVATION', name: 'Excavation', riskLevel: 'Medium', icon: '⛏️' },
      { id: 7, code: 'GENERAL', name: 'General Work', riskLevel: 'Low', icon: '🛠️' }
    ];
    setWorkAreas(defaultWorkAreas);
  };

  const savePermitsToStorage = (updatedPermits) => {
    try {
      localStorage.setItem('permits', JSON.stringify(updatedPermits));
      localStorage.setItem('permitsLastUpdated', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save permits to storage:', error);
    }
  };

  const fetchPermits = async (filters = {}) => {
    try {
      setLoading(true);
      // For demo - reload from localStorage
      // In real app: const response = await permitsAPI.getAll(filters);
      loadPermitsFromStorage();
    } catch (error) {
      console.error('Failed to fetch permits:', error);
      toast.error('Failed to load permits');
    } finally {
      setLoading(false);
    }
  };

  const createPermit = async (permitData) => {
    try {
      const newPermit = {
        ...permitData,
        id: Date.now(),
        permitNumber: `PER-${new Date().getFullYear()}-${String(permits.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPermits = [...permits, newPermit];
      setPermits(updatedPermits);
      savePermitsToStorage(updatedPermits);
      
      toast.success('Permit created successfully!');
      return newPermit;
    } catch (error) {
      console.error('Failed to create permit:', error);
      toast.error('Failed to create permit');
      throw error;
    }
  };

  const updatePermit = async (id, permitData) => {
    try {
      const updatedPermits = permits.map(p => 
        p.id === id ? { 
          ...p, 
          ...permitData, 
          updatedAt: new Date().toISOString(),
          permitNumber: p.permitNumber // Preserve permit number
        } : p
      );
      
      setPermits(updatedPermits);
      savePermitsToStorage(updatedPermits);
      
      toast.success('Permit updated successfully!');
      return updatedPermits.find(p => p.id === id);
    } catch (error) {
      console.error('Failed to update permit:', error);
      toast.error('Failed to update permit');
      throw error;
    }
  };

  const deletePermit = async (id) => {
    try {
      const updatedPermits = permits.filter(p => p.id !== id);
      setPermits(updatedPermits);
      savePermitsToStorage(updatedPermits);
      
      toast.success('Permit deleted successfully!');
    } catch (error) {
      console.error('Failed to delete permit:', error);
      toast.error('Failed to delete permit');
      throw error;
    }
  };

  // Workflow actions
  const verifyChecklist = async (id, checklistData) => {
    return updatePermit(id, {
      safetyChecklist: checklistData,
      status: 'pending_inspection',
      currentStep: 3,
      checklistVerifiedAt: new Date().toISOString()
    });
  };

  const completeInspection = async (id, inspectionData) => {
    return updatePermit(id, {
      inspection: inspectionData,
      status: 'pending_approval',
      currentStep: 4,
      inspectionCompletedAt: new Date().toISOString()
    });
  };

  const approvePermit = async (id, approvalData) => {
    return updatePermit(id, {
      approval: approvalData,
      status: 'approved',
      currentStep: 5,
      approvedAt: new Date().toISOString()
    });
  };

  const completeWork = async (id, completionData) => {
    return updatePermit(id, {
      workCompletion: completionData,
      status: 'pending_closure',
      currentStep: 6,
      workCompletedAt: new Date().toISOString()
    });
  };

  const closePermit = async (id, closureData) => {
    return updatePermit(id, {
      closure: closureData,
      status: 'closed',
      currentStep: 7,
      closedAt: new Date().toISOString()
    });
  };

  // Utility functions
  const getPermitById = (id) => {
    return permits.find(p => p.id === id);
  };

  const getPermitsByStatus = (status) => {
    return permits.filter(p => p.status === status);
  };

  const getPermitsByRequester = (requesterId) => {
    return permits.filter(p => p.requesterId === requesterId);
  };

  // Add the missing function here
  const getPermitsByWorkArea = (workArea) => {
    return permits.filter(p => p.workArea === workArea);
  };

  // Additional utility functions for analytics
  const getPermitsByDateRange = (startDate, endDate) => {
    return permits.filter(permit => {
      const permitDate = new Date(permit.submittedAt || permit.createdAt);
      return permitDate >= new Date(startDate) && permitDate <= new Date(endDate);
    });
  };

  const getStatistics = () => {
    const total = permits.length;
    const byStatus = permits.reduce((acc, permit) => {
      acc[permit.status] = (acc[permit.status] || 0) + 1;
      return acc;
    }, {});
    
    const byWorkArea = permits.reduce((acc, permit) => {
      acc[permit.workArea] = (acc[permit.workArea] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      byStatus,
      byWorkArea,
      approved: permits.filter(p => p.status === 'approved').length,
      closed: permits.filter(p => p.status === 'closed').length,
      pending: permits.filter(p => p.status.includes('pending')).length,
      rejected: permits.filter(p => p.status === 'rejected').length,
    };
  };

  const value = {
    permits,
    workAreas,
    loading,
    createPermit,
    updatePermit,
    deletePermit,
    fetchPermits,
    verifyChecklist,
    completeInspection,
    approvePermit,
    completeWork,
    closePermit,
    getPermitById,
    getPermitsByStatus,
    getPermitsByRequester,
    getPermitsByWorkArea, // Add this to the context value
    getPermitsByDateRange,
    getStatistics
  };

  return (
    <PermitContext.Provider value={value}>
      {children}
    </PermitContext.Provider>
  );
};