import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const response = await fetch('http://localhost:5000/api/scores/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      setError('Failed to load leaderboard. Please try again later.');
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="leaderboard-box">
            <p>Loading leaderboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <section className="leaderboard-section active">
          <div className="leaderboard-box">
            <h2>Top Players</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="leaderboard-list">
              {leaderboard.map((player, index) => (
                <div key={player._id} className="leaderboard-item">
                  <div className="rank">{index + 1}</div>
                  <div className="player-info">
                    <h3>{player.name || 'Anonymous'}</h3>
                    <span className="email">{player.email}</span>
                  </div>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="label">Quizzes Taken:</span>
                      <span className="value">{player.quizCount}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Average Score:</span>
                      <span className="value">{player.averageScore.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Leaderboard; 