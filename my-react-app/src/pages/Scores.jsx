import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { API_URL } from '../config';

function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScores();
  }, []);

  async function fetchScores() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = `${API_URL}/api/scores/my-scores`;
      console.log('Fetching scores from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch scores' }));
        throw new Error(errorData.message || `Failed to fetch scores (${response.status})`);
      }

      const data = await response.json();
      console.log('Received scores:', data);
      setScores(data);
      setError('');
    } catch (error) {
      console.error('Error fetching scores:', error);
      if (error.message.includes('401')) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load scores. Please try again later. ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="scores-box">
            <p>Loading scores...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <section className="scores-section active">
          <div className="scores-box">
            <h2>Your Quiz History</h2>
            {error && (
              <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
                {error}
              </div>
            )}
            {scores.length === 0 && !error ? (
              <p className="no-scores" style={{ textAlign: 'center', padding: '20px' }}>
                No quiz scores yet. Start playing to see your history!
              </p>
            ) : (
              <div className="scores-list">
                {scores.map((score) => (
                  <div key={score._id} className="score-item">
                    <div className="score-header">
                      <h3>{score.category || 'Unknown Category'}</h3>
                      <span className="score-date">
                        {new Date(score.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="score-details">
                      <span className="score-value">
                        Score: {score.score}/{score.totalQuestions}
                      </span>
                      <span className="score-percentage">
                        {Math.round((score.score / score.totalQuestions) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Scores; 