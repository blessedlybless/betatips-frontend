import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = "https://betatips-backend.onrender.com/api";


const AdminPanel = ({ onGameAdded }) => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newGame, setNewGame] = useState({
    homeTeam: '',
    awayTeam: '',
    prediction: '',
    odds: '',
    category: 'Value Tips',
    matchTime: ''
  });

  const categories = ['Value Tips', 'Sure Tips', 'Over/Under Tips', 'Bonus', 'VIP Tips'];

  useEffect(() => {
    fetchAllGames();
  }, []);

const fetchAllGames = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found - user not logged in');
      return;
    }
    
    const response = await axios.get(`${API_URL}/games/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    setGames(response.data);
    console.log('Games fetched successfully:', response.data.length);
    
  } catch (error) {
    console.error('Error fetching games:', error);
    if (error.response?.status === 401) {
      console.log('Authentication failed - token might be expired');
    }
  }
};


  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!newGame.homeTeam.trim()) {
    toast.error('Home team is required');
    setLoading(false);
    return;
  }
  if (!newGame.awayTeam.trim()) {
    toast.error('Away team is required');
    setLoading(false);
    return;
  }
  if (!newGame.prediction.trim()) {
    toast.error('Prediction is required');
    setLoading(false);
    return;
  }
  if (!newGame.odds || parseFloat(newGame.odds) <= 0) {
    toast.error('Valid odds are required');
    setLoading(false);
    return;
  }
  if (!newGame.matchTime) {
    toast.error('Match time is required');
    setLoading(false);
    return;
  }

const gameData = {
  homeTeam: newGame.homeTeam.trim(),
  awayTeam: newGame.awayTeam.trim(),
  prediction: newGame.prediction.trim(),
  odds: parseFloat(newGame.odds),
  league: newGame.category,          // ✅ Changed to 'league'
  gameTime: newGame.matchTime        // ✅ Changed to 'gameTime'
};

  try {
    // 🔑 GET THE TOKEN AND ADD IT TO THE REQUEST
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in first!');
      setLoading(false);
      return;
    }

    // 🚀 UPDATED AXIOS CALL WITH TOKEN
    await axios.post(`${API_URL}/games`, gameData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    toast.success('🎯 Game added successfully!', {
      duration: 3000,
      position: 'top-right',
    });

    setNewGame({
      homeTeam: '',
      awayTeam: '',
      prediction: '',
      odds: '',
      category: 'All Tips',
      matchTime: ''
    });

    // Add the rest of your function here (closing try block, catch block, etc.)


      fetchAllGames();
      if (onGameAdded) {
        onGameAdded();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          error.message;
      toast.error(`❌ Error adding game: ${errorMessage}`, {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await axios.delete(`${API_URL}/games/${id}`);
        fetchAllGames();
        if (onGameAdded) {
          onGameAdded();
        }
        toast.success('🗑️ Game deleted successfully!');
      } catch (error) {
        toast.error('❌ Error deleting game');
      }
    }
  };

  const updateResult = async (id, result) => {
    try {
      await axios.patch(`${API_URL}/games/${id}/result`, { result });
      fetchAllGames();
      if (onGameAdded) {
        onGameAdded();
      }
      toast.success(`✅ Result marked as ${result.toUpperCase()}!`);
    } catch (error) {
      toast.error('❌ Error updating result');
    }
  };

  const toggleUserVip = async (userId, currentStatus, username) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/vip`, {
        hasPaid: !currentStatus
      });
      
      fetchUsers();
      toast.success(
        !currentStatus 
          ? `👑 VIP access granted to ${username}!` 
          : `❌ VIP access removed from ${username}!`
      );
    } catch (error) {
      toast.error('Error updating user VIP status');
    }
  };

  const toggleUserStatus = async (userId, currentStatus, username) => {
    const action = currentStatus ? 'block' : 'unblock';
    
    if (window.confirm(`Are you sure you want to ${action} ${username}?`)) {
      try {
        await axios.patch(`${API_URL}/admin/users/${userId}/status`, {
          isActive: !currentStatus
        });
        
        fetchUsers();
        toast.success(
          !currentStatus 
            ? `✅ ${username} has been unblocked!` 
            : `🚫 ${username} has been blocked!`
        );
      } catch (error) {
        toast.error('Error updating user status');
      }
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="admin-panel">
      <Toaster />
      
      <div className="admin-header">
        <h2>🔧 Beta Tips Admin Panel</h2>
        <p className="admin-subtitle">Manage games, users, and access control</p>
      </div>
      
      <div className="admin-section">
        <h3>🎯 Add New Game</h3>
        <form onSubmit={handleSubmit} className="game-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Home Team (e.g., Arsenal)"
              value={newGame.homeTeam}
              onChange={(e) => setNewGame({...newGame, homeTeam: e.target.value})}
              disabled={loading}
              required
            />
            <input
              type="text"
              placeholder="Away Team (e.g., Chelsea)"
              value={newGame.awayTeam}
              onChange={(e) => setNewGame({...newGame, awayTeam: e.target.value})}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Prediction (e.g., Over 2.5, 1X, BTTS)"
              value={newGame.prediction}
              onChange={(e) => setNewGame({...newGame, prediction: e.target.value})}
              disabled={loading}
              required
            />
            <input
              type="number"
              step="0.01"
              min="1.01"
              placeholder="Odds (e.g., 1.85)"
              value={newGame.odds}
              onChange={(e) => setNewGame({...newGame, odds: e.target.value})}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-row">
            <select
              value={newGame.category}
              onChange={(e) => setNewGame({...newGame, category: e.target.value})}
              disabled={loading}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={newGame.matchTime}
              onChange={(e) => setNewGame({...newGame, matchTime: e.target.value})}
              min={getCurrentDateTime()}
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? '⏳ Adding...' : '🎯 Add Game'}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>⚽ Manage Games ({games.length} total)</h3>
        <div className="games-management">
          {games.length > 0 ? (
            games.map(game => (
              <div key={game._id} className="admin-game-item">
                <div className="game-info">
                  <h4>{game.homeTeam} vs {game.awayTeam}</h4>
                  <p><strong>Category:</strong> {game.category}</p>
                  <p><strong>Prediction:</strong> {game.prediction} @{game.odds}</p>
                  <p><strong>Time:</strong> {new Date(game.matchTime).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${game.result || 'pending'}`}>
                      {game.result ? (game.result === 'win' ? '✅ Won' : '❌ Lost') : '⏳ Pending'}
                    </span>
                  </p>
                </div>
                
                <div className="game-actions">
                  <button 
                    onClick={() => updateResult(game._id, 'win')}
                    className="win-btn"
                    disabled={game.result}
                    title="Mark as Win"
                  >
                    ✅ Win
                  </button>
                  <button 
                    onClick={() => updateResult(game._id, 'loss')}
                    className="loss-btn"
                    disabled={game.result}
                    title="Mark as Loss"
                  >
                    ❌ Loss
                  </button>
                  <button 
                    onClick={() => deleteGame(game._id)}
                    className="delete-btn"
                    title="Delete Game"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-games">
              <p>No games added yet. Add your first game above! 🎯</p>
            </div>
          )}
        </div>
      </div>

      {/* USER MANAGEMENT SECTION */}
      <div className="admin-section">
        <h3>👥 User Management</h3>
        
        <button 
          onClick={() => {
            setShowUserManagement(!showUserManagement);
            if (!showUserManagement) fetchUsers();
          }}
          className="toggle-btn"
        >
          {showUserManagement ? '🔼 Hide Users' : '🔽 Show Users'}
        </button>

        {showUserManagement && (
          <div className="users-management">
            <div className="users-header">
              <div className="user-stats">
                <span className="stat-item">
                  <strong>Total Users:</strong> {users.length}
                </span>
                <span className="stat-item">
                  <strong>VIP Users:</strong> {users.filter(u => u.hasPaid).length}
                </span>
                <span className="stat-item">
                  <strong>Active Users:</strong> {users.filter(u => u.isActive).length}
                </span>
                <span className="stat-item blocked">
                  <strong>Blocked Users:</strong> {users.filter(u => !u.isActive).length}
                </span>
              </div>
            </div>
            
            <div className="users-list">
              {users.length > 0 ? users.map(user => (
                <div key={user._id} className={`user-item ${!user.isActive ? 'blocked' : ''}`}>
                  <div className="user-info">
                    <h4>👤 {user.username}</h4>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>VIP Status:</strong> 
                      <span className={`status ${user.hasPaid ? 'vip' : 'free'}`}>
                        {user.hasPaid ? '👑 VIP Member' : '🆓 Free User'}
                      </span>
                    </p>
                    <p><strong>Account Status:</strong> 
                      <span className={`status ${user.isActive ? 'active' : 'blocked'}`}>
                        {user.isActive ? '✅ Active' : '🚫 Blocked'}
                      </span>
                    </p>
                    {user.hasPaid && user.vipExpiryDate && (
                      <p><strong>VIP Expires:</strong> 
                        <span className="expiry-date">
                          {new Date(user.vipExpiryDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <div className="user-actions">
                    <button 
                      onClick={() => toggleUserVip(user._id, user.hasPaid, user.username)}
                      className={user.hasPaid ? 'remove-vip-btn' : 'grant-vip-btn'}
                    >
                      {user.hasPaid ? '❌ Remove VIP' : '👑 Grant VIP'}
                    </button>
                    
                    <button 
                      onClick={() => toggleUserStatus(user._id, user.isActive, user.username)}
                      className={user.isActive ? 'block-user-btn' : 'unblock-user-btn'}
                    >
                      {user.isActive ? '🚫 Block User' : '✅ Unblock User'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="no-users">
                  <p>No users found. Users will appear here after they register.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="admin-footer">
        <a href="/" className="back-btn">
          ← Back to Beta Tips
        </a>
        <div className="admin-info">
          <p>Beta Tips Admin Dashboard v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
