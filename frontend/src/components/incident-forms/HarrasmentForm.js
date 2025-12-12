import React, { useState } from 'react';

const HarassmentForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    harassmentType: '',
    location: '',
    dateTime: '',
    description: '',
    perpetratorDetails: '',
    witnesses: '',
    evidence: null,
    anonymous: false
  });

  const harassmentTypes = [
    'Verbal Harassment',
    'Physical Harassment',
    'Sexual Harassment',
    'Cyber Harassment',
    'Discriminatory Harassment',
    'Other'
  ];

  const locations = ['DELL', 'ONESE', 'HIDDEN O-HOSTEL', 'OCHARBOON', 'OCANTERN'];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Harassment Report:', formData);
    alert('Harassment incident reported successfully!');
    onBack();
  };

  return (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h1>Harassment Incident Report</h1>
        <p>Please provide details about the harassment incident</p>
      </div>

      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Type of Harassment *</label>
          <select 
            name="harassmentType" 
            value={formData.harassmentType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select type</option>
            {harassmentTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
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
            placeholder="Please describe what happened, including what was said or done..."
            rows="5"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Perpetrator Details (if known)</label>
          <textarea
            name="perpetratorDetails"
            placeholder="Describe the person(s) involved (appearance, name if known, relationship to you)..."
            rows="3"
            value={formData.perpetratorDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="form-section">
          <label>Witnesses</label>
          <input
            type="text"
            name="witnesses"
            placeholder="Names or descriptions of any witnesses"
            value={formData.witnesses}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Evidence (Screenshots, photos, videos)</label>
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*,.pdf"
            onChange={handleInputChange}
            name="evidence"
          />
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
            />
            Report anonymously
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Harassment Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default HarassmentForm;