// src/components/Header.js
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Quiz</Link>
      <nav className="navbar">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>Leaderboard</NavLink>
        {token && <NavLink to="/scores" className={({ isActive }) => isActive ? 'active' : ''}>My Scores</NavLink>}
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        {!token ? (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
        ) : (
          <div className="user-section">
            <span className="user-name">Welcome, {user?.name || 'User'}</span>
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
