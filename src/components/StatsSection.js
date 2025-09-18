import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL =  "https://betatips-backend.onrender.com/api";



const StatsSection = () => {
  const [stats, setStats] = useState({
    totalTips: 0,
    winRate: 0,
    totalWins: 0,
    totalLoss: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/games`, {  // ✅ Correct endpoint
      headers: {
        'Authorization': `Bearer ${token}`  // ✅ Add auth token
      }
    });
    const games = response.data;
    
    const totalTips = games.length;
    const completedGames = games.filter(game => game.result);
    const totalWins = completedGames.filter(game => game.result === 'win').length;
    const totalLoss = completedGames.filter(game => game.result === 'loss').length;
    const winRate = completedGames.length > 0 ? ((totalWins / completedGames.length) * 100).toFixed(1) : 0;

    setStats({ totalTips, winRate, totalWins, totalLoss });
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};


  return (
    <div className="stats-section">
      <h3>🏆 Our Track Record</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalTips}</div>
          <div className="stat-label">Total Tips</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-number">{stats.winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
        <div className="stat-card win">
          <div className="stat-number">{stats.totalWins}</div>
          <div className="stat-label">✅ Wins</div>
        </div>
        <div className="stat-card loss">
          <div className="stat-number">{stats.totalLoss}</div>
          <div className="stat-label">❌ Losses</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
