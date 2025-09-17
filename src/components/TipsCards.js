import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatsSection from './StatsSection';
import Testimonials from './Testimonials';
import TrustBadges from './TrustBadges';
import PaymentButton from './PaymentButton';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.betatips.com.ng/api'
  : 'http://localhost:5000/api';

const TipsCards = ({ user, refreshTrigger, setUser }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState({
    'All Tips': [],
    'Sure Tips': [],
    'Over/Under Tips': [],
    'Bonus': [],
    'VIP Tips': []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchGames(selectedDate);
  }, [refreshTrigger, selectedDate]);

  const fetchGames = async (date) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/games/date/${formattedDate}`);
      const gamesByCategory = {
        'All Tips': [],
        'Sure Tips': [],
        'Over/Under Tips': [],
        'Bonus': [],
        'VIP Tips': []
      };

      response.data.forEach(game => {
        if (gamesByCategory[game.category]) {
          gamesByCategory[game.category].push(game);
        }
      });

      setGames(gamesByCategory);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setLoading(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getDateDisplayText = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today's Tips";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Tips";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow's Tips";
    } else {
      return `Tips for ${date.toLocaleDateString()}`;
    }
  };

  const TipCard = ({ title, gamesList, locked }) => (
    <div className={`tip-card ${locked ? 'locked' : ''}`}>
      <div className="card-header">
        <h3>{title}</h3>
        {title === 'VIP Tips' && (
          <div className="vip-price">
            <span className="price">₦10,000/month</span>
          </div>
        )}
      </div>
      
      <div className="card-content">
        {locked ? (
          <div className="locked-content">
            <div className="lock-icon">🔒</div>
            <p>Subscribe to access {title}</p>
            
            <PaymentButton user={user} setUser={setUser} />
            
            <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
              Get exclusive high-value predictions with better odds!
            </p>
          </div>
        ) : gamesList.length > 0 ? (
          <div className="games-list">
            {gamesList.map(game => (
              <div key={game._id} className="game-item">
                <div className="match-info">
                  <span className="teams">{game.homeTeam} vs {game.awayTeam}</span>
                  <span className="time">{new Date(game.matchTime).toLocaleTimeString()}</span>
                </div>
                <div className="prediction">
                  <span className="tip">{game.prediction}</span>
                  <span className="odds">@{game.odds}</span>
                </div>
                {game.result && (
                  <div className={`result ${game.result}`}>
                    {game.result === 'win' ? '✅ WIN' : '❌ LOSS'}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-games">
            <p>No games posted for this date yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading games...</div>;

  return (
    <div className="tips-container">
      {/* Date Filter Section */}
      <div className="date-filter-section">
        <div className="date-picker-container">
          <h2>{getDateDisplayText(selectedDate)}</h2>
          <div className="date-controls">
            <button 
              onClick={() => handleDateChange(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              className="date-nav-btn"
            >
              ← Previous Day
            </button>
            
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="date-picker"
              placeholderText="Select a date"
              maxDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
            />
            
            <button 
              onClick={() => handleDateChange(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              className="date-nav-btn"
              disabled={selectedDate >= new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
            >
              Next Day →
            </button>
          </div>
          
          <div className="quick-date-buttons">
            <button 
              onClick={() => handleDateChange(new Date(Date.now() - 24 * 60 * 60 * 1000))}
              className="quick-date-btn"
            >
              Yesterday
            </button>
            <button 
              onClick={() => handleDateChange(new Date())}
              className="quick-date-btn today"
            >
              Today
            </button>
            <button 
              onClick={() => handleDateChange(new Date(Date.now() + 24 * 60 * 60 * 1000))}
              className="quick-date-btn"
            >
              Tomorrow
            </button>
          </div>
        </div>
      </div>
      
      <TrustBadges />
      
      <div className="cards-grid">
        {Object.entries(games).map(([category, gamesList]) => (
          <TipCard
            key={category}
            title={category}
            gamesList={gamesList}
            locked={!user.hasPaid && category === 'VIP Tips'}
          />
        ))}
      </div>
      
      <div className="section-spacer"></div>
      
      <StatsSection />
      <Testimonials />
      
      <div className="community-button-section">
        <button 
          onClick={() => navigate('/community')}
          className="community-page-btn"
        >
          💬 Join Community Discussion
        </button>
      </div>
      
      {user.isAdmin && (
        <div className="admin-link">
          <a href="/admin" className="admin-btn">🔧 Admin Panel</a>
        </div>
      )}
    </div>
  );
};

export default TipsCards;
