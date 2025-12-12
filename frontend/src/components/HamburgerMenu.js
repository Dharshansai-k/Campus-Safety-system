import React, { useState } from "react";
import "./HamburgerMenu.css";
import { useNavigate } from 'react-router-dom';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSetting = () => {
    navigate('/profile');
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger icon */}
      <div className="hamburger-icon" onClick={() => setOpen(true)}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          
          <div className="close-btn" onClick={() => setOpen(false)}>
          
          </div>
        </div>

        <ul>
          <li onClick={() => handleNavigation('/')}>
            
            <span>Home</span>
          </li>
          <li onClick={() => handleNavigation('/report-incident')}>
            
            <span>Report Incident</span>
          </li>
          <li onClick={() => handleNavigation('/about')}>
            
            <span>About Us</span>
          </li>
          <li onClick={() => handleNavigation('/contact')}>
            
            <span>Contact Us</span>
          </li>
          <li className="setting-item" onClick={handleSetting}>
           
            <span>Profile</span>
          </li>
          <li className="close-side" onClick={() => setOpen(false)}>
            
            <span>Close Menu</span>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}