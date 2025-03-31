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
                <p>Choose from a wide range of topics including Science, History, Geography, and more!</p>
              </div>
              <div className="feature-card">
                <h3>Track Progress</h3>
                <p>Monitor your scores, view your history, and track your improvement over time.</p>
              </div>
              <div className="feature-card">
                <h3>Leaderboard</h3>
                <p>Compete with other players and see where you rank on our global leaderboard.</p>
              </div>
            </div>
            <button className="button" id="startQuiz" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </section>

        <section className="home-features">
          <div className="features-content">
            <h2>Why Choose Quiz Master?</h2>
            <div className="features-grid-extended">
              <div className="feature-card-extended">
                <h3>Time Challenge</h3>
                <p>Each question comes with a 15-second timer, adding excitement to your quiz experience!</p>
              </div>
              <div className="feature-card-extended">
                <h3>Instant Feedback</h3>
                <p>Get immediate feedback on your answers and learn from your mistakes.</p>
              </div>
              <div className="feature-card-extended">
                <h3>Progress Tracking</h3>
                <p>Keep track of your scores across different categories and see your improvement.</p>
              </div>
              <div className="feature-card-extended">
                <h3>Global Competition</h3>
                <p>Compete with players worldwide and climb the global leaderboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="home-categories">
          <div className="categories-content">
            <h2>Available Categories</h2>
            <div className="categories-preview">
              <div className="category-preview-card">
                <h3>Science</h3>
                <p>Test your knowledge in various scientific fields</p>
              </div>
              <div className="category-preview-card">
                <h3>History</h3>
                <p>Explore historical events and figures</p>
              </div>
              <div className="category-preview-card">
                <h3>Geography</h3>
                <p>Learn about countries, capitals, and more</p>
              </div>
              <div className="category-preview-card">
                <h3>Technology</h3>
                <p>Stay updated with tech knowledge</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
