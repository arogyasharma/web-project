// src/pages/Result.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { score, total } = state || { score: 0, total: 0 };

  return (
    <>
      <Header />
      <main className="main">
        <section className="result-section active">
          <div className="result-box">
            <h2>Quiz Result!</h2>
            <p className="score-text">
              Your Score: <span id="score">{score}</span>/<span id="total-questions">{total}</span>
            </p>
            <div className="result-buttons">
              <button className="restart-button button" onClick={() => window.location.reload()}>
                Restart Quiz
              </button>
              <button className="home-button button" onClick={() => navigate('/')}>
                Home
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Result;
