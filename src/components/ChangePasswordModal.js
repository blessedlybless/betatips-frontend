import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "https://betatips-backend.onrender.com/api";



const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // NEW: Track success state

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowSuccess(false); // Reset success state
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('❌ New passwords do not match', {
        duration: 4000,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('❌ New password must be at least 6 characters', {
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      
      // SUCCESS: Show success state INSIDE modal immediately
      setShowSuccess(true);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Also show toast for main page (will appear after modal closes)
      setTimeout(() => {
        toast.success('🎉 Password changed successfully! You can now use your new password for future logins.', {
          duration: 8000,
        });
      }, 500);
      
      // Close modal after 3 seconds so user sees success message inside modal
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Password change error:', error);
      
      if (error.response?.status === 400) {
        toast.error('❌ Current password is incorrect. Please check and try again.', {
          duration: 6000,
        });
      } else if (error.response?.status === 401) {
        toast.error('❌ Session expired. Please login again.', {
          duration: 6000,
        });
      } else {
        toast.error(error.response?.data?.message || '❌ Failed to change password. Please try again.', {
          duration: 6000,
        });
      }
    }
    setLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal" onClick={handleOverlayClick}>
      <div className="change-password-content">
        <button className="modal-close-x" onClick={onClose} title="Close">
          ✕
        </button>
        
        {!showSuccess ? (
          // NORMAL FORM STATE
          <>
            <h3>🔐 Change Password</h3>
            <p>Update your password to something you'll remember</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="change-password-btn"
                >
                  {loading ? '⏳ Updating Password...' : '✅ Change Password'}
                </button>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="cancel-btn"
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          // SUCCESS STATE - SHOWN INSIDE MODAL
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h3>Password Changed!</h3>
            <p>Your password has been successfully updated. You can now use your new password for future logins.</p>
            <div className="success-actions">
              <button onClick={onClose} className="success-btn">
                ✅ Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
