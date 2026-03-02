export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generatePermitNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PER-${timestamp}-${random}`;
};

export const getStatusColor = (status) => {
  const colors = {
    draft: '#95a5a6',
    pending: '#f39c12',
    under_review: '#3498db',
    approved: '#27ae60',
    rejected: '#e74c3c',
    in_progress: '#9b59b6',
    completed: '#2ecc71',
    closed: '#34495e'
  };
  return colors[status] || '#6c757d';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const calculateRiskScore = (workArea, safetyChecklist) => {
  if (!safetyChecklist || !safetyChecklist.answers) return 0;
  
  const answers = safetyChecklist.answers;
  const noAnswers = Object.values(answers).filter(answer => answer === 'no').length;
  const totalQuestions = Object.keys(answers).length;
  
  if (totalQuestions === 0) return 100;
  
  const complianceRate = ((totalQuestions - noAnswers) / totalQuestions) * 100;
  return Math.round(complianceRate);
};

export const formatRiskLevel = (score) => {
  if (score >= 90) return { level: 'Low', color: '#27ae60' };
  if (score >= 70) return { level: 'Medium', color: '#f39c12' };
  return { level: 'High', color: '#e74c3c' };
};