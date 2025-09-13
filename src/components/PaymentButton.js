import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
//import axios from 'axios';
//import toast from 'react-hot-toast';

//const API_URL = "https://betatips-backend.onrender.com/api";


const PaymentButton = ({ user, setUser }) => {
  const [showPayment, setShowPayment] = useState(false);

  const bankDetails = {
    accountName: "Beta Tips Nigeria",
    accountNumber: "1234567890",
    bankName: "First Bank Nigeria",
    accountType: "Current Account"
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPayment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPayment]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPayment(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPayment) {
        setShowPayment(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPayment]);

 

  // MODAL COMPONENT - RENDERED WITH PORTAL
  const PaymentModal = () => (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal-content">
        <h3>🏦 VIP Subscription Payment</h3>
        <p className="payment-amount">Amount: <strong>₦10,000/month</strong></p>
        
        <div className="bank-details">
          <h4>💳 Bank Transfer Details:</h4>
          <div className="detail-item">
            <strong>Account Name:</strong> {bankDetails.accountName}
          </div>
          <div className="detail-item">
            <strong>Account Number:</strong> {bankDetails.accountNumber}
          </div>
          <div className="detail-item">
            <strong>Bank:</strong> {bankDetails.bankName}
          </div>
          <div className="detail-item">
            <strong>Account Type:</strong> {bankDetails.accountType}
          </div>
        </div>

        <div className="payment-instructions">
          <h4>📋 Payment Instructions:</h4>
          <ol>
            <li>Transfer exactly <strong>₦10,000</strong> to the account above</li>
            <li>Take a screenshot of your transaction receipt</li>
            <li>Contact us on Telegram with your receipt</li>
            <li>We'll verify and activate your VIP access within 30 minutes</li>
          </ol>
        </div>

        <div className="contact-support">
          <a 
            href="https://t.me/betatips_support?text=Hi%20Beta%20Tips!%20I%20have%20made%20a%20payment%20for%20VIP%20subscription.%0A%0AAmount:%20₦10,000%0AUsername:%20[Your%20Username]%0ATransaction%20Reference:%20[Your%20Transaction%20ID]%0A%0APlease%20verify%20my%20payment%20and%20activate%20VIP%20access.%20I%20will%20send%20the%20receipt%20screenshot.%20Thank%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-contact-btn"
          >
            📱 Send Receipt via Telegram
          </a>
          <p className="contact-note">
            🚀 <strong>Fast Verification:</strong> Send your receipt and get VIP access within 30 minutes!
          </p>
        </div>

        <div className="payment-actions">
          <button 
            onClick={() => setShowPayment(false)} 
            className="close-btn"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setShowPayment(true)} className="payment-btn">
        💳 Subscribe to VIP - ₦10,000/month
      </button>

      {/* RENDER MODAL WITH PORTAL - OUTSIDE NORMAL DOM TREE */}
      {showPayment && createPortal(<PaymentModal />, document.body)}
    </>
  );
};

export default PaymentButton;
