import React, { useState } from 'react';

const OtherForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    incidentType: '',
    customType: '',
    location: '',
    dateTime: '',
    description: '',
    involvedPersons: '',
    evidence: null,
    urgency: 'medium'
  });

  const incidentTypes = [
    'Property Damage',
    'Noise Complaint',
    'Suspicious Activity',
    'Policy Violation',
    'Environmental Hazard',
    'Technology Issue',
    'Other (please specify)'
  ];

  const locations = ['DELL', 'ONESE', 'HIDDEN O-HOSTEL', 'OCHARBOON', 'OCANTERN'];

  const urgencyLevels = [
    { value: 'low', label: 'Low - No immediate action needed' },
    { value: 'medium', label: 'Medium - Should be addressed soon' },
    { value: 'high', label: 'High - Needs prompt attention' },
    { value: 'urgent', label: 'Urgent - Immediate action required' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Other Incident Report:', formData);
    alert('Incident reported successfully!');
    onBack();
  };

  return (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h1>Other Incident Report</h1>
        <p>Report any other type of incident not covered by other categories</p>
      </div>

      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Type of Incident *</label>
          <select 
            name="incidentType" 
            value={formData.incidentType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select incident type</option>
            {incidentTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {formData.incidentType === 'Other (please specify)' && (
          <div className="form-section">
            <label>Please Specify Incident Type *</label>
            <input
              type="text"
              name="customType"
              placeholder="Describe the type of incident"
              value={formData.customType}
              onChange={handleInputChange}
              required={formData.incidentType === 'Other (please specify)'}
            />
          </div>
        )}

        <div className="form-section">
          <label>Urgency Level *</label>
          <div className="urgency-buttons">
            {urgencyLevels.map((level, index) => (
              <button 
                key={index}
                type="button"
                className={`urgency-btn ${formData.urgency === level.value ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Location *</label>
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
          <label>Date and Time of Incident *</label>
          <input 
            type="datetime-local" 
            name="dateTime"
            value={formData.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Detailed Description *</label>
          <textarea
            name="description"
            placeholder="Please provide a complete description of the incident..."
            rows="5"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Persons Involved</label>
          <textarea
            name="involvedPersons"
            placeholder="Describe any persons involved in the incident..."
            rows="3"
            value={formData.involvedPersons}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="form-section">
          <label>Evidence (Photos, documents, etc.)</label>
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleInputChange}
            name="evidence"
          />
        </div>

        <div className="form-section">
          <label>Additional Comments</label>
          <textarea
            name="additionalComments"
            placeholder="Any additional information that might be helpful..."
            rows="2"
            value={formData.additionalComments}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Incident Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherForm;