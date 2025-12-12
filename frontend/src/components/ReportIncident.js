import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const ReportIncident = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  const incidentCategories = [
    { id: "harassment", name: "HARRASIMENT", description: "Report harassment incidents" },
    { id: "theft", name: "THEFT", description: "Report theft or stolen items" },
    { id: "health", name: "HEALTH EMERGENCY", description: "Report health-related issues" },
    { id: "other", name: "OTHER", description: "Report other types of incidents" },
    { id: "lost", name: "LOST ITEMS", description: "Report lost items or persons" },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(`/report-incident/${categoryId}`);
  };

  const handleBackToHome = () => navigate("/");
  const handleBackToCategories = () => {
    setSelectedCategory("");
    navigate("/report-incident");
  };

  // ✅ Django Submit Function
  const submitIncident = async (dataToSend) => {
    const formData = new FormData();
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) formData.append("evidence", value[i]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/reports/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("✅ Incident reported successfully!");
      console.log("Incident created:", res.data);
      handleBackToCategories();
    } catch (err) {
      console.error("Error submitting incident:", err);
      alert(`Error ${err.response?.status}: ${err.response?.data?.error || "Failed to submit"}`);
    }
  };

  // ---------------- HARRASSMENT FORM ----------------
  const HarassmentForm = () => {
    const [formData, setFormData] = useState({
      harassmentType: "",
      location: "",
      dateTime: "",
      description: "",
      evidence: null,
      anonymous: false,
    });

    const harassmentTypes = [
      "Verbal Harassment",
      "Physical Harassment",
      "Sexual Harassment",
      "Cyber Harassment",
      "Discriminatory Harassment",
      "Other",
    ];

    const handleInputChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files : value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      submitIncident({
        category: "harassment",
        title: formData.harassmentType,
        description: formData.description,
        location: formData.location,
        incident_datetime: formData.dateTime,
        anonymous: formData.anonymous ? "true" : "false",
        evidence: formData.evidence,
      });
    };

    return renderFormUI("Harassment Incident Report", formData, handleInputChange, handleSubmit);
  };

  // ---------------- THEFT FORM ----------------
  const TheftForm = () => {
    const [formData, setFormData] = useState({
      itemType: "",
      itemDescription: "",
      location: "",
      dateTime: "",
      evidence: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((p) => ({ ...p, [name]: files ? files : value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      submitIncident({
        category: "theft",
        title: formData.itemType,
        description: formData.itemDescription,
        location: formData.location,
        incident_datetime: formData.dateTime,
        evidence: formData.evidence,
      });
    };

    return renderFormUI("Theft Incident Report", formData, handleChange, handleSubmit);
  };

  // ---------------- HEALTH FORM ----------------
  const HealthForm = () => {
    const [formData, setFormData] = useState({
      issue: "",
      location: "",
      dateTime: "",
      description: "",
      evidence: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((p) => ({ ...p, [name]: files ? files : value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      submitIncident({
        category: "health",
        title: formData.issue,
        description: formData.description,
        location: formData.location,
        incident_datetime: formData.dateTime,
        evidence: formData.evidence,
      });
    };

    return renderFormUI("Health Emergency Report", formData, handleChange, handleSubmit);
  };

  // ---------------- OTHER FORM ----------------
  const OtherForm = () => {
    const [formData, setFormData] = useState({
      title: "",
      location: "",
      dateTime: "",
      description: "",
      evidence: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((p) => ({ ...p, [name]: files ? files : value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      submitIncident({
        category: "other",
        title: formData.title,
        description: formData.description,
        location: formData.location,
        incident_datetime: formData.dateTime,
        evidence: formData.evidence,
      });
    };

    return renderFormUI("Other Incident Report", formData, handleChange, handleSubmit);
  };

  // ---------------- LOST FORM ----------------
  const LostForm = () => {
    const [formData, setFormData] = useState({
      item: "",
      location: "",
      dateTime: "",
      description: "",
      evidence: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((p) => ({ ...p, [name]: files ? files : value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      submitIncident({
        category: "lost",
        title: formData.item,
        description: formData.description,
        location: formData.location,
        incident_datetime: formData.dateTime,
        evidence: formData.evidence,
      });
    };

    return renderFormUI("Lost Item Report", formData, handleChange, handleSubmit);
  };

  // ✅ Reusable Form UI Wrapper
  const renderFormUI = (title, formData, handleChange, handleSubmit) => (
    <div className="incident-form">
      <div className="form-header">
        <button className="back-button" onClick={handleBackToCategories}>
          ← Back to Categories
        </button>
        <h1>{title}</h1>
        <p>Please provide relevant details below</p>
      </div>
      <form onSubmit={handleSubmit} className="incident-details">
        <div className="form-section">
          <label>Title *</label>
          <input name="title" value={formData.title || ""} onChange={handleChange} required />
        </div>
        <div className="form-section">
          <label>Location *</label>
          <input name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-section">
          <label>Date & Time *</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-section">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="form-section">
          <label>Evidence (Optional)</label>
          <input type="file" multiple name="evidence" onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleBackToCategories}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );

  // 🔁 Form Switcher
  const renderForm = () => {
    switch (selectedCategory) {
      case "harassment": return <HarassmentForm />;
      case "theft": return <TheftForm />;
      case "health": return <HealthForm />;
      case "other": return <OtherForm />;
      case "lost": return <LostForm />;
      default: return null;
    }
  };

  // ---------------- CATEGORY CARDS UI (UNCHANGED) ----------------
  return (
    <div className="report-incident-page">
      <Header />
      <div className="report-incident-container">
        {!selectedCategory ? (
          <>
            <div className="report-header">
              <button className="back-button" onClick={handleBackToHome}>
                ← Back to Home
              </button>
              <h1>Report an Incident</h1>
              <p>Select the category that best describes your incident</p>
            </div>
            <div className="incident-categories">
              {incidentCategories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="category-name">{category.name}</div>
                  <div className="category-description">{category.description}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
};

export default ReportIncident;
