// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">Quiz</Link>
      <nav className="navbar">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
      </nav>
    </header>
  );
}

export default Header;
