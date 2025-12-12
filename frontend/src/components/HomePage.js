import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import EmergencySection from './EmergencySection';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      <EmergencySection />
    </div>
  );
};

export default HomePage;