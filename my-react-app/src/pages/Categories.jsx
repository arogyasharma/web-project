// src/pages/Categories.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Categories() {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);

  const handleCategoryClick = (category) => {
    // Save the selected category (if needed)
    localStorage.setItem('selectedCategory', category);
    setPopupVisible(true);
  };

  const handleExit = () => {
    setPopupVisible(false);
  };

  const handleContinue = () => {
    navigate('/quiz');
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="quiz-container">
          <h1 className="fade-in">Welcome to <span>Quiz Master</span></h1>
          <p className="sub-text">Test your knowledge and challenge yourself!</p>
          <div className="categories">
            <div className="category-card" onClick={() => handleCategoryClick('Science')}>
              <div className="category-icon">🔬</div>
              <h2>Science</h2>
            </div>
            <div className="category-card" onClick={() => handleCategoryClick('History')}>
              <div className="category-icon">🏛️</div>
              <h2>History</h2>
            </div>
            <div className="category-card" onClick={() => handleCategoryClick('Geography')}>
              <div className="category-icon">🌍</div>
              <h2>Geography</h2>
            </div>
            <div className="category-card" onClick={() => handleCategoryClick('Sports')}>
              <div className="category-icon">⚽</div>
              <h2>Sports</h2>
            </div>
            <div className="category-card" onClick={() => handleCategoryClick('Technology')}>
              <div className="category-icon">💻</div>
              <h2>Technology</h2>
            </div>
            <div className="category-card" onClick={() => handleCategoryClick('Movies')}>
              <div className="category-icon">🎬</div>
              <h2>Movies</h2>
            </div>
          </div>
          <div className="back-btn">
            <button className="btn back-btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </main>
      {popupVisible && (
        <div id="popup-overlay" className="popup-overlay" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h2>Quiz Guide</h2>
            <ol>
              <li>Read each question carefully.</li>
              <li>Select the correct answer.</li>
              <li>No negative marking.</li>
              <li>Good luck!</li>
            </ol>
            <div className="popup-buttons">
              <button id="exit-quiz" className="popup-button" onClick={handleExit}>Exit</button>
              <button id="continue-quiz" className="popup-button" onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
