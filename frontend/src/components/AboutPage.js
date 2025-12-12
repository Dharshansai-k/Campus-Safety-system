import React from 'react';
import Header from './Header';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Header />
      <div className="about-container">
        <div className="about-hero">
          <h1>About Campus Safety System</h1>
          <p>Ensuring a safe and secure environment for our campus community</p>
        </div>

        <div className="about-content">
          <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
              The Campus Safety System is dedicated to providing a comprehensive 
              safety solution for students, faculty, and staff. We believe that 
              everyone deserves to feel safe and secure in their educational environment.
            </p>
          </section>

          <section className="features-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚨</div>
                <h3>Emergency Response</h3>
                <p>Quick access to emergency services with just one click</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Incident Reporting</h3>
                <p>Easy and confidential reporting of various incidents</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>Safety Resources</h3>
                <p>Access to campus safety resources and information</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Mobile Friendly</h3>
                <p>Access safety features anytime, anywhere on your device</p>
              </div>
            </div>
          </section>

          <section className="team-section">
            <h2>Our Commitment</h2>
            <div className="commitment-grid">
              <div className="commitment-item">
                <h4>24/7 Availability</h4>
                <p>Our system is available round the clock to ensure your safety</p>
              </div>
              <div className="commitment-item">
                <h4>Confidentiality</h4>
                <p>All reports are handled with utmost privacy and discretion</p>
              </div>
              <div className="commitment-item">
                <h4>Rapid Response</h4>
                <p>Quick response times for emergency situations</p>
              </div>
              <div className="commitment-item">
                <h4>Community Focus</h4>
                <p>Built for the campus community, by the campus community</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;