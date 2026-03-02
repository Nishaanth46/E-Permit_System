export const WORK_AREAS = [
  { 
    id: 1, 
    name: 'Confined Space', 
    code: 'CS',
    riskLevel: 'High',
    description: 'Work in enclosed spaces with limited entry/exit points'
  },
  { 
    id: 2, 
    name: 'Hot Work', 
    code: 'HW',
    riskLevel: 'High',
    description: 'Work involving open flames, sparks, or high temperatures'
  },
  { 
    id: 3, 
    name: 'Electrical Work', 
    code: 'ELEC',
    riskLevel: 'High',
    description: 'Work on electrical systems and equipment'
  },
  { 
    id: 4, 
    name: 'Height Work', 
    code: 'HEIGHT',
    riskLevel: 'High',
    description: 'Work at elevated locations requiring fall protection'
  },
  { 
    id: 5, 
    name: 'Excavation', 
    code: 'EXCA',
    riskLevel: 'Medium',
    description: 'Digging, trenching, and earth moving operations'
  },
  { 
    id: 6, 
    name: 'Chemical Handling', 
    code: 'CHEM',
    riskLevel: 'High',
    description: 'Handling, storage, and use of hazardous chemicals'
  },
  { 
    id: 7, 
    name: 'Machine Maintenance', 
    code: 'MACHINE',
    riskLevel: 'Medium',
    description: 'Maintenance and repair of heavy machinery'
  }
];

export const PERMIT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CLOSED: 'closed'
};

export const USER_ROLES = {
  REQUESTER: 'requester',
  SAFETY_OFFICER: 'safety_officer',
  APPROVER: 'approver',
  ADMIN: 'admin'
};

export const WORKFLOW_STEPS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted to Safety Officer',
  SAFETY_REVIEW: 'Safety Checklist Review',
  APPROVAL: 'Management Approval',
  ISSUED: 'Permit Issued',
  WORK_STARTED: 'Work Started',
  WORK_COMPLETED: 'Work Completed',
  CLOSED: 'Permit Closed'
};

// Complete Safety Checklists for all 7 work areas
export const SAFETY_CHECKLISTS = {
  CS: [
    { id: 1, question: 'Is the confined space properly isolated?', required: true, category: 'Isolation' },
    { id: 2, question: 'Are atmospheric tests conducted and within safe limits?', required: true, category: 'Atmosphere' },
    { id: 3, question: 'Is rescue equipment available and functional?', required: true, category: 'Emergency' },
    { id: 4, question: 'Is ventilation adequate?', required: true, category: 'Ventilation' },
    { id: 5, question: 'Are communication systems tested?', required: false, category: 'Communication' }
  ],
  HW: [
    { id: 1, question: 'Are fire extinguishers available within 10 meters?', required: true, category: 'Fire Safety' },
    { id: 2, question: 'Are flammable materials removed from the area?', required: true, category: 'Hazard Control' },
    { id: 3, question: 'Is fire watch assigned and trained?', required: true, category: 'Personnel' },
    { id: 4, question: 'Are spark containment measures in place?', required: false, category: 'Prevention' }
  ],
  ELEC: [
    { id: 1, question: 'Is the electrical system properly isolated?', required: true, category: 'Isolation' },
    { id: 2, question: 'Are lockout/tagout procedures followed?', required: true, category: 'Safety Procedures' },
    { id: 3, question: 'Is testing equipment calibrated?', required: true, category: 'Equipment' },
    { id: 4, question: 'Are proper PPE being used?', required: true, category: 'PPE' }
  ],
  HEIGHT: [
    { id: 1, question: 'Are fall protection systems installed?', required: true, category: 'Fall Protection' },
    { id: 2, question: 'Is the work area properly barricaded?', required: true, category: 'Area Control' },
    { id: 3, question: 'Are weather conditions suitable for work?', required: true, category: 'Environment' },
    { id: 4, question: 'Is equipment certified and inspected?', required: true, category: 'Equipment' }
  ],
  EXCA: [
    { id: 1, question: 'Are underground utilities located and marked?', required: true, category: 'Utility Safety' },
    { id: 2, question: 'Is proper shoring/sloping in place?', required: true, category: 'Structural Safety' },
    { id: 3, question: 'Is access/egress provided?', required: true, category: 'Access' },
    { id: 4, question: 'Are spoils placed at safe distance?', required: false, category: 'Housekeeping' }
  ],
  CHEM: [
    { id: 1, question: 'Are MSDS sheets available and reviewed?', required: true, category: 'Documentation' },
    { id: 2, question: 'Is spill containment available?', required: true, category: 'Containment' },
    { id: 3, question: 'Are proper ventilation systems operational?', required: true, category: 'Ventilation' },
    { id: 4, question: 'Is emergency eyewash/shower accessible?', required: true, category: 'Emergency' }
  ],
  MACHINE: [
    { id: 1, question: 'Is machine properly locked out/tagged out?', required: true, category: 'Isolation' },
    { id: 2, question: 'Are all energy sources isolated?', required: true, category: 'Energy Control' },
    { id: 3, question: 'Is try-out conducted after maintenance?', required: true, category: 'Testing' },
    { id: 4, question: 'Are guards and safety devices functional?', required: true, category: 'Safety Devices' }
  ]
};

export const RISK_LEVELS = {
  HIGH: { color: '#e74c3c', label: 'High Risk' },
  MEDIUM: { color: '#f39c12', label: 'Medium Risk' },
  LOW: { color: '#27ae60', label: 'Low Risk' }
};