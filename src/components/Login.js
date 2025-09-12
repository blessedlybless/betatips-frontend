import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = "https://betatips-backend.onrender.com/api";


const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Attempting login...'); // Debug log
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: formData.username,
        password: formData.password
      });

      console.log('✅ Login successful:', response.data); // Debug log
      
      // ONLY set user and token on SUCCESS
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      
      toast.success('✅ Login successful! Welcome back!', {
        duration: 3000,
      });
      
    } catch (error) {
      console.error('❌ Login error:', error); // Debug log
      
      // IMPORTANT: DO NOT call setUser(null) here
      // Just show error message and stay on login page
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error('❌ Invalid username or password. Please check your credentials and try again.', {
          duration: 6000,
        });
      } else if (error.response?.status === 403) {
        toast.error('❌ Account has been deactivated. Contact support for help.', {
          duration: 6000,
        });
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`, {
          duration: 5000,
        });
      } else {
        toast.error('❌ Login failed. Please check your internet connection and try again.', {
          duration: 5000,
        });
      }
      
      // Clear password field for security
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? '🔐 Login to Beta Tips' : '👤 Join Beta Tips'}</h2>
        
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : (isLogin ? '🔐 Login' : '👤 Register')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-btn"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>

      <div className="login-help-section">
        <h3>🆘 Need Help?</h3>
        <p>Forgot your password? Can't access your account? We're here to help!</p>
        
        <a 
          href="https://t.me/betatips_support?text=Hi%20Beta%20Tips!%20I%20need%20help%20with%20my%20account.%20My%20issue:%20Forgot%20Password.%20Please%20help%20me%20reset%20my%20account.%20Thank%20you!"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-help-btn"
        >
          📱 Get Help on Telegram
        </a>
        
        <div className="help-features">
          <div className="help-feature">
            <span>⚡ Fast Response (30 min)</span>
          </div>
          <div className="help-feature">
            <span>🕘 Available 9AM - 9PM</span>
          </div>
          <div className="help-feature">
            <span>🆓 Free Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
