import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { API_URL } from '../config';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const url = `${API_URL}/api/scores/leaderboard`;
      console.log('Attempting to fetch leaderboard from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers]),
        url: response.url
      });

      const contentType = response.headers.get("content-type");
      console.log('Content-Type:', contentType);

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response body:', text);
        throw new Error(`Server responded with status ${response.status}: ${text}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Leaderboard data received:', data);

      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        throw new Error('Server returned invalid data format');
      }

      setLeaderboard(data);
      setError('');
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to load leaderboard: ${error.message}`);
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
            {error && (
              <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
                {error}
              </div>
            )}
            <div className="leaderboard-list">
              {!error && leaderboard.length === 0 ? (
                <div className="no-data" style={{ textAlign: 'center', padding: '20px' }}>
                  No leaderboard data available yet.
                </div>
              ) : (
                leaderboard.map((player, index) => (
                  <div key={player._id || index} className="leaderboard-item">
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
                        <span className="value">{player.averageScore?.toFixed(1) || '0'}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Leaderboard; 