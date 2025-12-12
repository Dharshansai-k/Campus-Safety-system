import React, { useState, useEffect } from 'react';
import Header from './Header';
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Helper: get CSRF token
  const getCookie = (name) => {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  };

  // ✅ Fetch profile data
  useEffect(() => {
    fetch('http://localhost:8000/api/auth/profile/', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Please login again to view your profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save updated profile data
  const handleSave = async () => {
    const csrftoken = getCookie('csrftoken');

    try {
      const res = await fetch('http://localhost:8000/api/auth/profile/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setMessage(data.message);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <p>{message || 'No profile data found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        {message && <div className="status-message">{message}</div>}

        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">
                {profileData.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p className="profile-role">{profileData.role}</p>
            <p className="profile-id">ID: {profileData.student_id}</p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>💾 Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>👤 Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profileData.name}</p>
                )}
              </div>

              <div className="info-item">
                <label>Email</label>
                <p>{profileData.email}</p>
              </div>

              <div className="info-item">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p>{profileData.phone || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>🎓 Academic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Student ID</label>
                <p>{profileData.student_id}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{profileData.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
