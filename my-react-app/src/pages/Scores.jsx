import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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

      const response = await fetch('http://localhost:5000/api/scores/my-scores', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }

      const data = await response.json();
      setScores(data);
    } catch (error) {
      setError('Failed to load scores. Please try again later.');
      console.error('Error fetching scores:', error);
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
            {error && <div className="error-message">{error}</div>}
            {scores.length === 0 ? (
              <p>No quiz scores yet. Start playing to see your history!</p>
            ) : (
              <div className="scores-list">
                {scores.map((score) => (
                  <div key={score._id} className="score-item">
                    <div className="score-header">
                      <h3>{score.category}</h3>
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