import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleLogout = () => {
    alert('You have been logged out successfully!');
    navigate('/auth/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <HamburgerMenu />
          
        </div>
        
        <nav className="navbar">
          <div className="nav-left">
            <span 
              className={`nav-item ${isHomePage ? 'active' : ''}`}
              onClick={handleHomeClick}
            >
              Home
            </span>
            <span className="nav-item" onClick={handleAboutClick}>
              About us
            </span>
            <span className="nav-item" onClick={handleContactClick}>
              Contact us
            </span>
          </div>
        </nav>

        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;