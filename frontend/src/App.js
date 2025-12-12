import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import ReportIncident from './components/ReportIncident';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import AdminDashboard from "./components/AdminDashboard";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/report-incident" element={<ReportIncident />} />
          <Route path="/report-incident/:category" element={<ReportIncident />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
