import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pdfService } from '../../services/pdfService';
import { emailService } from '../../services/emailService';
import { toast } from 'react-toastify';

const containerStyles = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center'
};

const successStyles = {
  backgroundColor: '#d5f4e6',
  padding: '25px',
  borderRadius: '8px',
  border: '2px solid #27ae60',
  marginBottom: '25px'
};

const permitCardStyles = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '8px',
  border: '2px solid #3498db',
  marginBottom: '25px'
};

const qrCodeStyles = {
  width: '150px',
  height: '150px',
  backgroundColor: '#f0f0f0',
  margin: '20px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  border: '1px solid #bdc3c7'
};

const notificationListStyles = {
  textAlign: 'left',
  backgroundColor: '#e8f4f8',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '25px'
};

const buttonGroupStyles = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'center',
  marginTop: '25px'
};

const primaryButtonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const secondaryButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const PermitIssueNotification = ({ permit, onComplete }) => {
  const { user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    issuePermit();
  }, []);

  const issuePermit = async () => {
    try {
      // Generate PDF
      const pdfUrl = await pdfService.generatePermitPDF(permit);
      setPdfUrl(pdfUrl);

      // Send notifications
      await sendNotifications();

      // Store in DMS (simulated)
      await storeInDMS();

      toast.success('Permit issued successfully!');
    } catch (error) {
      toast.error('Error issuing permit');
    }
  };

  const sendNotifications = async () => {
    setIsSending(true);
    const notificationList = [];

    try {
      // Notify Requester
      const requesterEmail = `${permit.requesterName.toLowerCase().replace(' ', '.')}@company.com`;
      notificationList.push({
        recipient: permit.requesterName,
        email: requesterEmail,
        status: 'Sending...'
      });

      // Notify Safety Officer
      const safetyEmail = 'safety.officer@company.com';
      notificationList.push({
        recipient: 'Safety Officer',
        email: safetyEmail,
        status: 'Sending...'
      });

      // Notify Area Supervisor
      const supervisorEmail = 'area.supervisor@company.com';
      notificationList.push({
        recipient: 'Area Supervisor',
        email: supervisorEmail,
        status: 'Sending...'
      });

      setNotifications(notificationList);

      // Simulate email sending
      for (let i = 0; i < notificationList.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        notificationList[i].status = '✅ Sent';
        setNotifications([...notificationList]);
      }

      await emailService.notifyApproval(permit, requesterEmail);
      
    } catch (error) {
      notificationList.forEach(notif => notif.status = '❌ Failed');
      setNotifications([...notificationList]);
    } finally {
      setIsSending(false);
    }
  };

  const storeInDMS = async () => {
    // Simulate DMS storage
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Permit stored in DMS:', permit.permitNumber);
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      pdfService.downloadPDF(pdfUrl, `permit-${permit.permitNumber}.pdf`);
    }
  };

  const viewPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div style={containerStyles}>
      {/* Success Message */}
      <div style={successStyles}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
        <h2 style={{ color: '#27ae60', marginBottom: '10px' }}>Permit Successfully Issued!</h2>
        <p style={{ color: '#2c3e50', fontSize: '16px' }}>
          The safety permit has been approved and issued. Work can now commence.
        </p>
      </div>

      {/* Permit Card */}
      <div style={permitCardStyles}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>🛡️ Safety Permit</h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db', marginBottom: '10px' }}>
          {permit.permitNumber}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
          {permit.workArea}
        </div>
        <div style={{ color: '#7f8c8d', marginBottom: '15px' }}>
          {permit.location}
        </div>
        
        {/* QR Code Placeholder */}
        <div style={qrCodeStyles}>
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ fontSize: '12px' }}>QR CODE</div>
            <div style={{ fontSize: '10px' }}>{permit.permitNumber}</div>
          </div>
        </div>

        <div style={{ marginTop: '15px', fontSize: '14px', color: '#7f8c8d' }}>
          <div>Valid From: {new Date(permit.startDate).toLocaleString()}</div>
          <div>Valid Until: {new Date(permit.endDate).toLocaleString()}</div>
          <div>Issued By: {user?.name}</div>
          <div>Issue Time: {new Date().toLocaleString()}</div>
        </div>
      </div>

      {/* Notifications */}
      <div style={notificationListStyles}>
        <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>📧 Notifications Sent</h4>
        {notifications.map((notification, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #d1ecf1'
          }}>
            <div>
              <strong>{notification.recipient}</strong>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{notification.email}</div>
            </div>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: '600',
              color: notification.status.includes('✅') ? '#27ae60' : 
                     notification.status.includes('❌') ? '#e74c3c' : '#f39c12'
            }}>
              {notification.status}
            </div>
          </div>
        ))}
        
        {isSending && (
          <div style={{ textAlign: 'center', marginTop: '15px', color: '#3498db' }}>
            ⏳ Sending notifications...
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '6px', 
        border: '1px solid #ffeaa7',
        marginBottom: '25px'
      }}>
        <h4 style={{ color: '#856404', marginBottom: '8px' }}>⚠️ Important Notice</h4>
        <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
          Work must NOT commence until the printed permit is displayed at the work location. 
          All safety procedures must be followed throughout the work duration.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={buttonGroupStyles}>
        <button 
          style={primaryButtonStyles}
          onClick={viewPDF}
          disabled={!pdfUrl}
        >
          📄 View Permit PDF
        </button>
        <button 
          style={secondaryButtonStyles}
          onClick={downloadPDF}
          disabled={!pdfUrl}
        >
          ⬇️ Download Permit
        </button>
        <button 
          style={{
            ...primaryButtonStyles,
            backgroundColor: '#27ae60'
          }}
          onClick={onComplete}
        >
          ✅ Complete Issue Process
        </button>
      </div>
    </div>
  );
};

export default PermitIssueNotification;
