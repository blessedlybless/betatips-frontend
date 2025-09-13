import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './App.css';
import TipsCards from './components/TipsCards';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Community from './components/Community';
import ChangePasswordModal from './components/ChangePasswordModal';
import axios from 'axios';

const API_URL = "https://betatips-backend.onrender.com/api";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      
      // ONLY logout if there's a valid token but it's invalid
      // Don't logout on login form errors
      const token = localStorage.getItem('token');
      if (token && (error.response?.status === 401 || error.response?.status === 403)) {
        console.log('Token expired or invalid, logging out...');
        logout();
      }
      // If no token, just set loading to false - user will see login page
    }
    setLoading(false);
  };

  const logout = () => {
    console.log('🔐 Logging out user...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setRefreshTrigger(0);
    console.log('✅ Logout complete');
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading Beta Tips...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Helmet>
            <title>Beta Tips - Professional Football Predictions Nigeria | Daily Betting Tips</title>
            <meta name="description" content="Get daily winning football predictions from professional tipsters in Nigeria. Join 1000+ winners with our VIP tips, over/under predictions, and expert analysis. Start winning today!" />
            <meta name="keywords" content="football predictions Nigeria, betting tips, sports betting, football tips Lagos, over under tips, VIP predictions, sure tips, bet9ja tips, sportybet tips" />
            
            <meta property="og:title" content="Beta Tips - Professional Football Predictions Nigeria" />
            <meta property="og:description" content="Get daily winning football predictions from professional tipsters. Join 1000+ winners betting smart in Nigeria!" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://betatips.com.ng" />
            <meta property="og:image" content="https://betatips.com.ng/logo-social.png" />
            <meta property="og:site_name" content="Beta Tips" />
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Beta Tips - Professional Football Predictions Nigeria" />
            <meta name="twitter:description" content="Daily winning football predictions. Join 1000+ winners betting smart!" />
            <meta name="twitter:image" content="https://betatips.com.ng/logo-twitter.png" />
            
            <meta name="author" content="Beta Tips Nigeria" />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href="https://betatips.com.ng" />
            
            <meta name="geo.region" content="NG" />
            <meta name="geo.country" content="Nigeria" />
            <meta name="geo.placename" content="Nigeria" />
            
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Beta Tips",
                "description": "Professional Sports Predictions Platform Nigeria",
                "url": "https://betatips.com.ng",
                "logo": "https://betatips.com.ng/logo.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+234-XXX-XXX-XXXX",
                  "contactType": "customer service"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "Nigeria"
                },
                "sameAs": [
                  "https://facebook.com/betatipsng",
                  "https://twitter.com/betatipsng",
                  "https://instagram.com/betatipsng"
                ]
              })}
            </script>
          </Helmet>

          <header className="app-header">
            <h1>🚀 Beta Tips</h1>
            <div className="social-icons">
              <span>📱 Follow us: </span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                📘 Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                🐦 Twitter
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                📷 Instagram
              </a>
            </div>
            
            {user && (
              <div className="user-info">
                <span>Welcome, {user?.username}</span>
                {user?.hasPaid && <span className="vip-badge">👑 VIP</span>}
                {user?.isAdmin && <span className="admin-badge">🔧 ADMIN</span>}
                
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="change-pass-btn"
                  title="Change Password"
                >
                  🔑 Change Password
                </button>
                
                <button onClick={logout} className="logout-btn">
                  🔓 Logout
                </button>
              </div>
            )}
          </header>

          <div className="banner">
            <div className="bookies-banner">
              <span>🎯 Trusted Bookies:</span>
              <div className="bookie-icons">
                <a href="https://sportybet.com" target="_blank" rel="noopener noreferrer" className="bookie-item">
                  🎰 SportyBet
                </a>
                <a href="https://betano.com" target="_blank" rel="noopener noreferrer" className="bookie-item">
                  🎲 Betano
                </a>
                <a href="https://bet9ja.com" target="_blank" rel="noopener noreferrer" className="bookie-item">
                  ⚽ Bet9ja
                </a>
              </div>
            </div>
          </div>

          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
            } />
            <Route path="/admin" element={
              user?.isAdmin ? 
              <AdminPanel onGameAdded={triggerRefresh} /> : 
              <Navigate to="/" replace />
            } />
            <Route path="/community" element={
              user ? <Community user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/" element={
              user ? 
              <TipsCards 
                user={user} 
                refreshTrigger={refreshTrigger} 
                setUser={setUser} 
              /> : 
              <Navigate to="/login" replace />
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* TOAST CONTAINER - ALWAYS ON TOP */}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                zIndex: 99999,
              },
            }}
          />

          {/* CHANGE PASSWORD MODAL */}
          <ChangePasswordModal 
            isOpen={showChangePassword}
            onClose={() => setShowChangePassword(false)}
          />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
