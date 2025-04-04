import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import About from './pages/About';
import Login from './pages/Login';
import Scores from './pages/Scores';
import Leaderboard from './pages/Leaderboard';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
