import React from 'react';
import './Navbar.css';
import logo from './logo.png'; // Adjust the path as necessary

const Navbar = () => {
  return (
    <div className="big">
      <nav className="menu-container">
        <input type="checkbox" aria-label="Toggle menu" />
        <span></span>
        <span></span>
        <span></span>

        <a href="/" className="menu-logo">
          <img src={logo} alt="My Awesome Website"/>
        </a>

        <p className="title">
          Web3 Ticketing
        </p>
      </nav>
    </div>
  );
}

export default Navbar;
