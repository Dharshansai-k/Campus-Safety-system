import React, { useState } from 'react';

const TheftForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    itemType: '',
    itemDescription: '',
    value: '',
    location: '',
    dateTime: '',
    lastSeen: '',
    suspectDetails: '',
    serialNumber: '',
    insurance: false,
    evidence: null
  });

  const itemTypes = [
    'Electronics',
    'Jewelry',
    'Cash',
    'Documents',
    'Clothing',
    'Books',
    'Other Personal Items'
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
    console.log('Theft Report:', formData);
    alert('Theft incident reported successfully!');
    onBack();
  };

  return (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h1>Theft Incident Report</h1>
        <p>Report stolen or missing items</p>
      </div>

      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Type of Item *</label>
          <select 
            name="itemType" 
            value={formData.itemType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select item type</option>
            {itemTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Item Description *</label>
          <textarea
            name="itemDescription"
            placeholder="Detailed description of the stolen item (color, brand, size, distinctive features)..."
            rows="3"
            value={formData.itemDescription}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Approximate Value *</label>
          <input
            type="text"
            name="value"
            placeholder="Estimated value of the item"
            value={formData.value}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Serial Number (if applicable)</label>
          <input
            type="text"
            name="serialNumber"
            placeholder="Serial number or identifying numbers"
            value={formData.serialNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Location Where Item Was Stolen *</label>
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
          <label>Date and Time When Stolen *</label>
          <input 
            type="datetime-local" 
            name="dateTime"
            value={formData.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Last Time You Saw the Item</label>
          <input 
            type="datetime-local" 
            name="lastSeen"
            value={formData.lastSeen}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Suspect Information (if any)</label>
          <textarea
            name="suspectDetails"
            placeholder="Description of any suspicious persons or activities..."
            rows="3"
            value={formData.suspectDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="form-section">
          <label>Item Photos or Purchase Receipt</label>
          <input 
            type="file" 
            accept="image/*,.pdf"
            onChange={handleInputChange}
            name="evidence"
          />
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="insurance"
              checked={formData.insurance}
              onChange={handleInputChange}
            />
            Item is insured
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Theft Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default TheftForm;