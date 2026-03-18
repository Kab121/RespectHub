import React, { useState, useEffect } from "react";
import { adminAPI, actionTypesAPI } from "../../services/api.js";
import {
  Filter,
  Calendar,
  Award,
  ExternalLink,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

export default function ReviewQueue() {
  const [actions, setActions] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [actionTypes, setActionTypes] = useState({});
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  const loadData = async (currentFilter = "pending") => {
    try {
      setLoading(true);

      const [typesRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        actionTypesAPI.getAll(),
        adminAPI.getActions("pending"),
        adminAPI.getActions("approved"),
        adminAPI.getActions("rejected"),
      ]);

      const pendingActions = Array.isArray(pendingRes.data) ? pendingRes.data : [];
      const approvedActions = Array.isArray(approvedRes.data) ? approvedRes.data : [];
      const rejectedActions = Array.isArray(rejectedRes.data) ? rejectedRes.data : [];

      const allLoadedActions = [
        ...pendingActions,
        ...approvedActions,
        ...rejectedActions,
      ];

      let currentActions = [];
      if (currentFilter === "all") currentActions = allLoadedActions;
      if (currentFilter === "pending") currentActions = pendingActions;
      if (currentFilter === "approved") currentActions = approvedActions;
      if (currentFilter === "rejected") currentActions = rejectedActions;

      const typesMap = {};
      const typesData = Array.isArray(typesRes.data) ? typesRes.data : [];
      typesData.forEach((type) => {
        typesMap[type.id] = type;
      });

      setActions(currentActions);
      setAllActions(allLoadedActions);
      setActionTypes(typesMap);
    } catch (err) {
      console.error("Failed to load review queue:", err);
      setActions([]);
      setAllActions([]);
      setActionTypes({});
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (actionId) => {
    setReviewingId(actionId);

    try {
      await adminAPI.approveAction(actionId);
      await loadData(filter);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve action");
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (actionId) => {
    const note = prompt("Rejection reason (optional):");
    setReviewingId(actionId);

    try {
      await adminAPI.rejectAction(actionId, {
        reviewNote: note || "Rejected",
      });
      await loadData(filter);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject action");
    } finally {
      setReviewingId(null);
    }
  };

  const statusCounts = {
    all: allActions.length,
    pending: allActions.filter((a) => a.status === "pending").length,
    approved: allActions.filter((a) => a.status === "approved").length,
    rejected: allActions.filter((a) => a.status === "rejected").length,
  };

  const getActionTypeDetails = (action) => {
    if (action?.ActionType) return action.ActionType;

    const typeId = action.actionTypeId || action.action_type_id || action.ActionTypeId;
    return actionTypes[typeId] || null;
  };

  const getCreatedDate = (action) => {
    return action.createdAt || action.created_at || action.updatedAt || null;
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
        <h1>Review Queue</h1>
        <p>Review and approve community action submissions</p>
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
              type="button"
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="count">{statusCounts[status] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="review-grid">
        {actions.length === 0 ? (
          <div className="empty-state">
            <p>No {filter !== "all" ? filter : ""} actions to review</p>
            <p className="text-muted">
              {filter === "pending"
                ? "All caught up! No pending submissions."
                : `No ${filter} actions found.`}
            </p>
          </div>
        ) : (
          actions.map((action) => {
            const isReviewing = reviewingId === action.id;
            const user = action.User || action.user || {};
            const type = getActionTypeDetails(action);
            const media = action.media || action.SubmissionMedia || [];
            const createdDate = getCreatedDate(action);

            return (
              <div key={action.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <div className="user-avatar">
                      {(user?.fullName || user?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4>{user?.fullName || user?.name || "Unknown User"}</h4>
                      <p className="user-flat">{user?.email || "No email"}</p>
                    </div>
                  </div>

                  <span className={`status-badge status-${action.status}`}>
                    {action.status}
                  </span>
                </div>

                <div className="review-card-body">
                  <div className="action-type-header">
                    <h3>{type?.title || "Action"}</h3>

                    <div className="points-badge">
                      <Award size={16} />
                      <span>{type?.pointsAwarded ?? type?.points ?? 0} points</span>
                    </div>
                  </div>

                  <p className="action-description">{action.description || "No description provided."}</p>

                  {createdDate && (
                    <div className="action-meta">
                      <span className="meta-item">
                        <Calendar size={14} />
                        {new Date(createdDate).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {new Date(createdDate).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {media.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      {media.map((file, index) => {
                        const fileUrl = file.fileUrl || file.url || file.path;
                        const fileType = file.fileType || file.type || "file";

                        if (!fileUrl) return null;

                        const fullUrl = fileUrl.startsWith("http")
                          ? fileUrl
                          : `http://localhost:5000${fileUrl}`;

                        return (
                          <div key={file.id || index} style={{ marginBottom: "8px" }}>
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="proof-link"
                            >
                              <ExternalLink size={14} />
                              View {fileType}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {action.proof_url && (
                    <div style={{ marginTop: "8px" }}>
                      <a
                        href={action.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proof-link"
                      >
                        <ExternalLink size={14} />
                        View proof link
                      </a>
                    </div>
                  )}

                  {(action.reviewNote || action.admin_note) && (
                    <div className="admin-note-display">
                      <FileText size={14} />
                      <strong>Note:</strong> {action.reviewNote || action.admin_note}
                    </div>
                  )}
                </div>

                {action.status === "pending" && (
                  <div className="review-card-actions">
                    <button
                      type="button"
                      className="btn-reject"
                      onClick={() => handleReject(action.id)}
                      disabled={isReviewing}
                    >
                      <XCircle size={18} />
                      {isReviewing ? "Processing..." : "Reject"}
                    </button>

                    <button
                      type="button"
                      className="btn-approve"
                      onClick={() => handleApprove(action.id)}
                      disabled={isReviewing}
                    >
                      <CheckCircle size={18} />
                      {isReviewing ? "Processing..." : "Approve"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}