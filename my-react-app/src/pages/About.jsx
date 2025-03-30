import React from 'react';
import Header from '../components/Header';

function About() {
  return (
    <>
      <Header />
      <main className="main">
        <section className="about-section active">
          <div className="about-box">
            <h1>About Quiz Master</h1>
            <div className="about-content">
              <div className="about-item">
                <h2>Welcome to Quiz Master!</h2>
                <p>
                  Quiz Master is an interactive quiz application that allows you to test your knowledge across various categories.
                  Challenge yourself with questions from Science, History, Geography, Sports, Technology, and Movies.
                </p>
              </div>

              <div className="about-item">
                <h2>Features</h2>
                <ul>
                  <li>Multiple quiz categories</li>
                  <li>Track your scores</li>
                  <li>View your quiz history</li>
                  <li>User-friendly interface</li>
                </ul>
              </div>

              <div className="about-item">
                <h2>Project Information</h2>
                <p>
                  This project was developed as part of our Web Development course project.
                  It demonstrates the implementation of a full-stack web application using:
                </p>
                <ul>
                  <li>React.js for the frontend</li>
                  <li>Node.js and Express for the backend</li>
                  <li>MongoDB for data storage</li>
                  <li>Passport.js for authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default About; 