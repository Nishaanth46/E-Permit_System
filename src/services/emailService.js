// Mock Email Service - Integrate with your email system
export const emailService = {
  sendNotification: (to, subject, message, permitData = null) => {
    // Mock email sending
    console.log('Email Notification:', {
      to,
      subject,
      message,
      permitData
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Notification sent successfully' });
      }, 500);
    });
  },

  notifySafetyOfficer: (permitData, safetyOfficerEmail) => {
    const subject = `New Permit Request - ${permitData.permitNumber}`;
    const message = `
      A new safety permit has been submitted for review.
      
      Permit Details:
      - Work Area: ${permitData.workArea}
      - Location: ${permitData.location}
      - Requester: ${permitData.requesterName}
      - Description: ${permitData.workDescription}
      
      Please review the safety checklist and approve/reject the permit.
    `;

    return emailService.sendNotification(safetyOfficerEmail, subject, message, permitData);
  },

  notifyApproval: (permitData, requesterEmail) => {
    const subject = `Permit Approved - ${permitData.permitNumber}`;
    const message = `
      Your safety permit has been approved.
      
      Permit Details:
      - Permit Number: ${permitData.permitNumber}
      - Work Area: ${permitData.workArea}
      - Valid From: ${new Date(permitData.startDate).toLocaleDateString()}
      - Valid To: ${new Date(permitData.endDate).toLocaleDateString()}
      - Approved By: ${permitData.approvedBy}
      
      You may now proceed with the work following all safety procedures.
    `;

    return emailService.sendNotification(requesterEmail, subject, message, permitData);
  }
};