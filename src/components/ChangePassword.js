import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "https://betatips-backend.onrender.com/api";


const ChangePassword = React.memo(({ user, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`${API_URL}/auth/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const ModalContent = () => (
    <div className="change-password-modal" onClick={handleOverlayClick}>
      <div className="change-password-content">
        <button className="modal-close-x" onClick={onClose} title="Close">
          ✕
        </button>
        
        <h3>🔐 Change Password</h3>
        <p>Update your password to something you'll remember</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password (min 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="change-password-btn"
            >
              {loading ? '⏳ Updating...' : '✅ Change Password'}
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
      </div>
    </div>
  );

  return createPortal(<ModalContent />, document.body);
});

ChangePassword.displayName = 'ChangePassword';

export default ChangePassword;
