import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencySection = () => {
  const navigate = useNavigate();

  const handleEmergency = () => {
    // Add emergency functionality
    alert('Emergency button clicked! Please call emergency services immediately.');
  };

  const handleReportIncident = () => {
    navigate('/report-incident');
  };

  return (
    <section className="emergency-section">
      <div className="emergency-container">
        <div className="emergency-button emergency" onClick={handleEmergency}>
          Emergency
        </div>
        <div className="emergency-button report" onClick={handleReportIncident}>
          Report Incident
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;