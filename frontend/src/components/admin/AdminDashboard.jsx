import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api.js";
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Residents",
      value: stats?.total_residents || 0,
      icon: Users,
      color: "primary",
    },
    {
      label: "Pending Reviews",
      value: stats?.pending_actions || 0,
      icon: Clock,
      color: "warning",
    },
    {
      label: "Approved Actions",
      value: stats?.approved_actions || 0,
      icon: CheckCircle,
      color: "success",
    },
    {
      label: "Rejected Actions",
      value: stats?.rejected_actions || 0,
      icon: XCircle,
      color: "danger",
    },
  ];

  const totalSubmissions =
    (stats?.pending_actions || 0) +
    (stats?.approved_actions || 0) +
    (stats?.rejected_actions || 0);

  const approvalRate =
    (stats?.approved_actions || 0) + (stats?.rejected_actions || 0) > 0
      ? Math.round(
          ((stats?.approved_actions || 0) /
            ((stats?.approved_actions || 0) + (stats?.rejected_actions || 0))) *
            100
        )
      : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor community activity and manage submissions</p>
      </div>

      <div className="stats-grid admin-stats">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <Icon />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Activity Overview</h3>
            <TrendingUp size={20} />
          </div>

          <div className="card-content">
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-label">Total Submissions</span>
                <span className="activity-value">{totalSubmissions}</span>
              </div>

              <div className="activity-item">
                <span className="activity-label">Approval Rate</span>
                <span className="activity-value">{approvalRate}%</span>
              </div>

              <div className="activity-item">
                <span className="activity-label">Active Residents</span>
                <span className="activity-value">{stats?.total_residents || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>

          <div className="card-content">
            <div className="quick-actions">
              <a href="/admin/review" className="quick-action-btn">
                <Clock size={20} />
                <div>
                  <h4>Review Queue</h4>
                  <p>{stats?.pending_actions || 0} pending submissions</p>
                </div>
              </a>

              <a href="/admin/leaderboard" className="quick-action-btn">
                <Users size={20} />
                <div>
                  <h4>View Leaderboard</h4>
                  <p>See community rankings</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
