import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // helper: read cookie
  const getCookie = (name) => {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  };

  // ensure CSRF cookie exists (call on mount) — use localhost
  useEffect(() => {
    fetch('http://localhost:8000/api/auth/csrf/', {
      method: 'GET',
      credentials: 'include'
    }).catch(() => {
      // ignore - attempt to set cookie
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validation
  const validateForm = () => {
    if (!formData.email || !formData.password) return 'Please fill in all required fields';

    if (!isLogin) {
      if (!formData.name || !formData.studentId) return 'Please fill in all required fields';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
      if (formData.password.length < 6) return 'Password must be at least 6 characters long';
      if (!formData.email.endsWith('.in')) return 'Please use your campus email address (.in)';
    }
    return null;
  };

  // Django API Integration with CSRF + session auth (safe parse)
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    setLoading(false);
    return;
  }

  try {
    const endpoint = isLogin
      ? 'http://localhost:8000/api/auth/login/'
      : 'http://localhost:8000/api/auth/register/';

    const payload = isLogin
      ? { username: formData.email, password: formData.password }
      : {
          username: formData.email,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          student_id: formData.studentId,
          phone: formData.phone,
          role: formData.role,
        };

    const csrftoken = getCookie('csrftoken');

    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      throw new Error(`Server returned non-JSON response:\n${text}`);
    }

    if (!res.ok) {
      const msg = data.error || data.detail || JSON.stringify(data);
      throw new Error(msg || 'Authentication failed');
    }

    // ✅ Save user in localStorage
    localStorage.setItem('user', JSON.stringify(data));

    // ✅ Redirect to home page after login or registration
    navigate('/');

    if (onLogin) onLogin(data);
  } catch (err) {
    setError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      studentId: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="campus-logo">
            <h1>Campus Safety</h1>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to your campus safety portal' : 'Register for campus safety services'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name<span className="required">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Student ID<span className="required">*</span></label>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Role<span className="required">*</span></label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Campus Email<span className="required">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password<span className="required">*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password<span className="required">*</span></label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="switch-mode-btn" onClick={switchMode}>
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <div className="safety-features">
          <h4>Emergency Contacts</h4>
          <div className="emergency-contacts">
            <div><strong>Campus Police:</strong> (555) 123-4567</div>
            <div><strong>Emergency:</strong> 911</div>
            <div><strong>Health Center:</strong> (555) 123-4568</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;