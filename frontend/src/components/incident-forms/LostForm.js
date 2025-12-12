import React, { useState } from 'react';

const LostForm = ({ onBack }) => {
  const [formData, setFormData]  = useState({
    lostItemType: '',
    itemDescription: '',
    lastSeenLocation: '',
    lastSeenDateTime: '',
    ownerDetails: '',
    contactInfo: '',
    reward: false,
    rewardAmount: '',
    distinctiveFeatures: '',
    photos: null
  });

  const lostItemTypes = [
    'Personal Belongings',
    'Electronics',
    'Jewelry',
    'Documents',
    'Keys',
    'Clothing',
    'Books',
    'Backpack/Bag',
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
    console.log('Lost Item Report:', formData);
    alert('Lost item reported successfully! We will notify you if it is found.');
    onBack();
  };

  return (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h1>Lost Item Report</h1>
        <p>Report lost items or personal belongings</p>
      </div>

      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Type of Lost Item *</label>
          <select 
            name="lostItemType" 
            value={formData.lostItemType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select item type</option>
            {lostItemTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Item Description *</label>
          <textarea
            name="itemDescription"
            placeholder="Detailed description of the lost item (color, brand, size, contents if applicable)..."
            rows="3"
            value={formData.itemDescription}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label>Distinctive Features</label>
          <textarea
            name="distinctiveFeatures"
            placeholder="Any unique features, scratches, stickers, or identifying marks..."
            rows="2"
            value={formData.distinctiveFeatures}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="form-section">
          <label>Last Seen Location *</label>
          <div className="location-buttons">
            {locations.map((location, index) => (
              <button 
                key={index}
                type="button"
                className={`location-btn ${formData.lastSeenLocation === location ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, lastSeenLocation: location }))}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Last Seen Date and Time *</label>
          <input 
            type="datetime-local" 
            name="lastSeenDateTime"
            value={formData.lastSeenDateTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Your Contact Information *</label>
          <input
            type="text"
            name="contactInfo"
            placeholder="Phone number and/or email where we can reach you"
            value={formData.contactInfo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <label>Owner Information</label>
          <input
            type="text"
            name="ownerDetails"
            placeholder="Your name and any other identifying information"
            value={formData.ownerDetails}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Photos of Similar Item</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleInputChange}
            name="photos"
          />
          <small>Upload photos of similar items if you don't have photos of the actual lost item</small>
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="reward"
              checked={formData.reward}
              onChange={handleInputChange}
            />
            Offering reward for return
          </label>
        </div>

        {formData.reward && (
          <div className="form-section">
            <label>Reward Amount</label>
            <input
              type="text"
              name="rewardAmount"
              placeholder="Amount you're offering as reward"
              value={formData.rewardAmount}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="helpful-tips">
          <h4>Helpful Tips:</h4>
          <ul>
            <li>Check with the lost and found office in each location</li>
            <li>Retrace your steps from when you last had the item</li>
            <li>Ask friends or classmates if they've seen your item</li>
            <li>Check common areas like cafeterias, libraries, and study rooms</li>
          </ul>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Lost Item Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default LostForm;