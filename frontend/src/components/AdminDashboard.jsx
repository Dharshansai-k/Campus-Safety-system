import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const AdminDashboard = () => {
  const [data, setData] = useState({ category_stats: [], incidents: [] });
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/dashboard/", {
          withCredentials: true,
        });
        setData(res.data);
        setFilteredIncidents(res.data.incidents);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err.response?.status === 403
            ? "Access denied. You must be an admin or logged in."
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // 🔹 Filter incidents by category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredIncidents(data.incidents);
    } else {
      setFilteredIncidents(
        data.incidents.filter(
          (incident) => incident.category.toLowerCase() === category.toLowerCase()
        )
      );
    }
  };

  if (loading) return <p className="loading">Loading admin data...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-dashboard">
      <Header />

      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <p>Manage and view all reported incidents</p>

        {/* Category Stats */}
        <div className="category-stats">
          <h2>Incident Statistics</h2>
          <div className="stats-grid">
            {/* "All" category card */}
            <div
              className={`stat-card ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => handleCategoryClick("All")}
            >
              <h3>All</h3>
              <p>{data.incidents.length} Reports</p>
            </div>

            {/* Dynamic category cards */}
            {data.category_stats.map((cat, i) => (
              <div
                key={i}
                className={`stat-card ${
                  selectedCategory === cat.category ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(cat.category)}
              >
                <h3>{cat.category.toUpperCase()}</h3>
                <p>{cat.total} Reports</p>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Table */}
        <div className="incident-table-section">
          <h2>
            {selectedCategory === "All"
              ? "All Reported Incidents"
              : `${selectedCategory.toUpperCase()} Incidents`}
          </h2>

          <table className="incident-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Email</th>
                <th>Location</th>
                <th>Date</th>
                <th>Anonymous</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No incidents found for this category.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.category}</td>
                    <td>{incident.title}</td>
                    <td>{incident.reporter?.name}</td>
                    <td>{incident.reporter?.email}</td>
                    <td>{incident.location}</td>
                    <td>{new Date(incident.incident_datetime).toLocaleString()}</td>
                    <td>{incident.anonymous ? "Yes" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dashboard-container { padding: 20px; }
        .category-stats { margin-top: 30px; }
        .stats-grid { display: flex; gap: 20px; flex-wrap: wrap; }
        .stat-card {
          background: #1c96acff;
          border-radius: 12px;
          padding: 15px 25px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .stat-card:hover { transform: scale(1.05); }
        .stat-card.active {
          background: #234972ff;
          color: white;
          transform: scale(1.05);
        }
        .incident-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }
        .incident-table th, .incident-table td {
          border: 1px solid #c9c2c9ff;
          padding: 10px;
          text-align: left;
        }
        .incident-table th {
          background: #234972ff;
          color: white;
        }
        .loading, .error { text-align: center; margin-top: 30px; }
        .error { color: red; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
