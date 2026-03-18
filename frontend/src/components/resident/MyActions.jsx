import React, { useState, useEffect } from "react";
import { actionAPI } from "../../services/api.js";
import { Filter, Calendar, Award, ExternalLink } from "lucide-react";

export default function MyActions() {
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const actionsRes = await actionAPI.getMyActions();
      setActions(actionsRes.data);
    } catch (err) {
      console.error("Failed to load actions:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActions = actions.filter((action) => {
    if (filter === "all") return true;
    return action.status === filter;
  });

  const statusCounts = {
    all: actions.length,
    pending: actions.filter((a) => a.status === "pending").length,
    approved: actions.filter((a) => a.status === "approved").length,
    rejected: actions.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Actions</h1>
        <p>View and track all your submitted actions</p>
      </div>

      <div className="filter-bar">
        <div className="filter-label">
          <Filter size={18} />
          <span>Filter by status:</span>
        </div>

        <div className="filter-buttons">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
              type="button"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="count">{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="actions-grid">
        {filteredActions.length === 0 ? (
          <div className="empty-state">
            <p>No {filter !== "all" ? filter : ""} actions found</p>
          </div>
        ) : (
          filteredActions.map((action) => {
            const actionType = action.ActionType;
            const media = action.media || [];

            return (
              <div key={action.id} className="action-card">
                <div className="action-card-header">
                  <div>
                    <h3>{actionType?.title || "Action"}</h3>

                    <p className="action-date">
                      <Calendar size={14} />
                      {new Date(action.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span className={`status-badge status-${action.status}`}>
                    {action.status}
                  </span>
                </div>

                <div className="action-card-body">
                  <p className="action-description">{action.description}</p>

                  {media.map((file) => (
                    <a
                      key={file.id}
                      href={`http://localhost:5000${file.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-link"
                    >
                      <ExternalLink size={16} />
                      View {file.fileType}
                    </a>
                  ))}
                </div>

                <div className="action-card-footer">
                  <div className="points-badge">
                    <Award size={16} />
                    <span>{actionType?.pointsAwarded ?? 0} points</span>
                  </div>

                  {action.reviewNote && (
                    <div className="admin-note">
                      <strong>Admin Note:</strong> {action.reviewNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}