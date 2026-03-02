// Mock PDF Service - In real implementation, use libraries like jsPDF or pdfkit
export const pdfService = {
  generatePermitPDF: (permitData) => {
    // This is a mock implementation
    // In real application, use jsPDF or similar library
    const pdfContent = {
      title: `SAFETY PERMIT - ${permitData.permitNumber}`,
      workArea: permitData.workArea,
      location: permitData.location,
      description: permitData.workDescription,
      requester: permitData.requesterName,
      dates: {
        start: permitData.startDate,
        end: permitData.endDate
      },
      safetyChecklist: permitData.safetyChecklist,
      approvedBy: permitData.approvedBy,
      approvedAt: permitData.approvedAt,
      conditions: [
        'This permit must be displayed at the work location',
        'All safety precautions must be followed',
        'Work must stop immediately if unsafe conditions develop',
        'Permit must be returned to safety office upon completion'
      ]
    };

    // Mock PDF generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPdfUrl = `data:application/pdf;base64,mock-pdf-data-${permitData.permitNumber}`;
        resolve(mockPdfUrl);
      }, 1000);
    });
  },

  downloadPDF: (pdfUrl, filename) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};