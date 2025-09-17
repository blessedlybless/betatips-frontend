import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { PAYMENT_CONFIG } from '../config/paymentConfig';

const ManualPayment = ({ user, onClose, isOpen }) => {
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.accountNumber);
    toast.success('Account number copied!');
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.bankName);
    toast.success('Bank name copied!');
  };

  const handleCopyAccountName = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.accountName);
    toast.success('Account name copied!');
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="manual-payment-overlay">
        <div className="manual-payment-card">
          <h3>💳 Beta Tips VIP Payment</h3>
          
          <div className="payment-amount">
            <span className="amount">₦{PAYMENT_CONFIG.vipPrice.toLocaleString()}</span>
            <span className="period">/{PAYMENT_CONFIG.vipDuration}</span>
          </div>

          <div className="bank-details">
            <h4>🏦 Bank Transfer Details:</h4>
            
            <div className="detail-item">
              <span className="label">Bank:</span>
              <div className="value-copy">
                <span className="value">{PAYMENT_CONFIG.bankName}</span>
                <button onClick={handleCopyBank} className="copy-btn">📋 Copy</button>
              </div>
            </div>

            <div className="detail-item">
              <span className="label">Account Number:</span>
              <div className="value-copy">
                <span className="value">{PAYMENT_CONFIG.accountNumber}</span>
                <button onClick={handleCopyAccount} className="copy-btn">📋 Copy</button>
              </div>
            </div>

            <div className="detail-item">
              <span className="label">Account Name:</span>
              <div className="value-copy">
                <span className="value">{PAYMENT_CONFIG.accountName}</span>
                <button onClick={handleCopyAccountName} className="copy-btn">📋 Copy</button>
              </div>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          {PAYMENT_CONFIG.alternativePayments && PAYMENT_CONFIG.alternativePayments.length > 0 && (
            <div className="alternative-payments">
              <h4>📱 Alternative Payment Methods:</h4>
              {PAYMENT_CONFIG.alternativePayments.map((payment, index) => (
                <div key={index} className="alt-payment-item">
                  <span className="payment-method">{payment.method}:</span>
                  <span className="payment-number">{payment.number}</span>
                  <span className="payment-name">({payment.name})</span>
                </div>
              ))}
            </div>
          )}

          <div className="payment-instructions">
            <h4>✅ After Payment:</h4>
            <ol>
              <li>📸 Send screenshot of payment receipt</li>
              <li>📝 Include your username: <strong>{user.username}</strong></li>
              <li>💬 WhatsApp us for instant activation</li>
              <li>⚡ Your VIP access activated within 1 hour</li>
            </ol>
          </div>

          <div className="whatsapp-link">
            <a 
              href={`${PAYMENT_CONFIG.whatsappLink}?text=Hello Beta Tips! I just made VIP payment of ₦${PAYMENT_CONFIG.vipPrice.toLocaleString()}. My username is: ${user.username}. Please activate my VIP access.`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Send WhatsApp Message
            </a>
          </div>

          <button onClick={onClose} className="close-btn">❌ Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default ManualPayment;
