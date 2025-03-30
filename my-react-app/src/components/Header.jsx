// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');

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
          <button 
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
