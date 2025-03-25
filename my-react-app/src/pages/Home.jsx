// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();

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
              Welcome to Quiz Master! Test your knowledge and challenge yourself.
            </p>
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
