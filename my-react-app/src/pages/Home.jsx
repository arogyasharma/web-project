import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleStartQuiz = () => {
    navigate('/categories');
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="home active">
          <div className="home-content">
            <h1 id="heading">Quiz Master</h1>
            <p id="details">
              {token ? (
                <>
                  Welcome back, {user?.name || 'Quiz Master'}! Ready to challenge yourself?
                  <br />
                  Test your knowledge across various categories and compete with others.
                </>
              ) : (
                <>
                  Welcome to Quiz Master! Test your knowledge and challenge yourself.
                  <br />
                  Login to track your progress and compete on the leaderboard.
                </>
              )}
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Multiple Categories</h3>
                <p>Choose from a wide range of topics</p>
              </div>
              <div className="feature-card">
                <h3>Track Progress</h3>
                <p>Monitor your scores and improvement</p>
              </div>
              <div className="feature-card">
                <h3>Leaderboard</h3>
                <p>Compete with other players</p>
              </div>
            </div>
            <button className="button" id="startQuiz" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
