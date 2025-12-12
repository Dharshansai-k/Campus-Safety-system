import React, { useState } from 'react';

const HealthForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    emergencyLevel: '',
    healthIssue: '',
    symptoms: '',
    location: '',
    dateTime: '',
    currentCondition: '',
    medications: '',
    allergies: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const emergencyLevels = [
    'Low - Non-urgent',
    'Medium - Needs attention soon',
    'High - Urgent care needed',
    'Critical - Emergency situation'
  ];

  const healthIssues = [
    'Physical Injury',
    'Illness/Fever',
    'Mental Health Crisis',
    'Allergic Reaction',
    'Chronic Condition Flare-up',
    'Other Medical Issue'
  ];

  const locations = ['DELL', 'ONESE', 'HIDDEN O-HOSTEL', 'OCHARBOON', 'OCANTERN'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Health Incident Report:', formData);
    
    if (formData.emergencyLevel.includes('Critical') || formData.emergencyLevel.includes('High')) {
      alert('URGENT: Health incident reported! Emergency services have been notified.');
    } else {
      alert('Health incident reported successfully! Campus health services will contact you soon.');
    }
    
    onBack();
  };

  return (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h1>Health Incident Report</h1>
        <p>Report health-related issues and emergencies</p>
      </div>

      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Emergency Level *</label>
          <select 
            name="emergencyLevel" 
            value={formData.emergencyLevel}
            onChange={handleInputChange}
            required
          >
            <option value="">Select emergency level</option>
            {emergencyLevels.map((level, index) => (
              <option key={index} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Type of Health Issue *</label>
          <select 
            name="healthIssue" 
            value={formData.healthIssue}
            onChange={handleInputChange}
            required
          >
            <option value="">Select health issue</option>
            {healthIssues.map((issue, index) => (
              <option key={index} value={issue}>{issue}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Symptoms *</label>
          <textarea
            name="symptoms"
            placeholder="Describe your symptoms in detail..."
            rows="3"
            value={formData.symptoms}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Current Condition *</label>
          <textarea
            name="currentCondition"
            placeholder="How are you feeling right now? Are you able to move?..."
            rows="2"
            value={formData.currentCondition}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Location Where Help is Needed *</label>
          <div className="location-buttons">
            {locations.map((location, index) => (
              <button 
                key={index}
                type="button"
                className={`location-btn ${formData.location === location ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, location }))}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>When Did Symptoms Start? *</label>
          <input 
            type="datetime-local" 
            name="dateTime"
            value={formData.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Current Medications</label>
          <input
            type="text"
            name="medications"
            placeholder="List any medications you are currently taking"
            value={formData.medications}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Known Allergies</label>
          <input
            type="text"
            name="allergies"
            placeholder="List any known allergies"
            value={formData.allergies}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Emergency Contact Information</label>
          <input
            type="text"
            name="emergencyContact"
            placeholder="Name and phone number of emergency contact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Relevant Medical History</label>
          <textarea
            name="medicalHistory"
            placeholder="Any relevant medical history we should know about..."
            rows="2"
            value={formData.medicalHistory}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="urgent-notice">
          <strong>For emergencies requiring immediate medical attention, please call campus security or 911 immediately.</strong>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Health Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthForm;