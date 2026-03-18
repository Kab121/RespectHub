import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { actionAPI, actionTypesAPI } from "../../services/api";
import { Award, TrendingUp, Star, Activity } from "lucide-react";

/** Badge thresholds */
const BADGES = [
  { name: "Bronze", min: 0, nextAt: 100 },
  { name: "Silver", min: 100, nextAt: 250 },
  { name: "Gold", min: 250, nextAt: 500 },
  { name: "Platinum", min: 500, nextAt: 1000 },
  { name: "Diamond", min: 1000, nextAt: null },
];

function getBadgeInfo(totalPoints) {
  let current = BADGES[0];

  for (const badge of BADGES) {
    if (totalPoints >= badge.min) current = badge;
  }

  const nextBadge =
    current.nextAt === null
      ? null
      : BADGES.find((b) => b.min === current.nextAt)?.name || null;

  return {
    current_badge: current.name,
    next_badge: nextBadge,
    next_badge_threshold: current.nextAt,
  };
}

export default function ResidentDashboard() {
  const { user } = useAuth();

  const [actions, setActions] = useState([]);
  const [actionTypes, setActionTypes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [actionsRes, typesRes] = await Promise.all([
          actionAPI.getMyActions(),
          actionTypesAPI.getAll(),
        ]);

        const actionsData = Array.isArray(actionsRes.data) ? actionsRes.data : [];
        const typesData = Array.isArray(typesRes.data) ? typesRes.data : [];

        const typesMap = {};
        typesData.forEach((type) => {
          typesMap[type.id] = type;
        });

        setActions(actionsData);
        setActionTypes(typesMap);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setActions([]);
        setActionTypes({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedActions = useMemo(() => {
    return [...actions].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [actions]);

  const recentActions = useMemo(() => sortedActions.slice(0, 5), [sortedActions]);

  const totalPoints = useMemo(() => {
    return actions.reduce((sum, action) => {
      if ((action.status || "").toLowerCase() !== "approved") return sum;

      // safest source: saved on approval
      if (action.pointsGranted != null) {
        return sum + Number(action.pointsGranted || 0);
      }

      // fallback from action type map
      const typeId =
        action.actionTypeId || action.action_type_id || action.ActionTypeId;

      const type = action.ActionType || actionTypes[typeId];
      const pts = Number(type?.pointsAwarded ?? type?.points ?? 0);

      return sum + (Number.isFinite(pts) ? pts : 0);
    }, 0);
  }, [actions, actionTypes]);

  const badgeInfo = useMemo(() => getBadgeInfo(totalPoints), [totalPoints]);

  const badgeProgress = useMemo(() => {
    if (!badgeInfo.next_badge_threshold) return 100;
    return Math.min(100, (totalPoints / badgeInfo.next_badge_threshold) * 100);
  }, [badgeInfo.next_badge_threshold, totalPoints]);

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
        <h1>Welcome back, {user?.fullName || user?.name || "User"}! 👋</h1>
        <p>Track your community contributions and earn respect points</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Star />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Points</p>
            <h2 className="stat-value">{totalPoints}</h2>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">
            <Award />
          </div>
          <div className="stat-content">
            <p className="stat-label">Current Badge</p>
            <h2 className="stat-value">{badgeInfo.current_badge}</h2>
          </div>
        </div>

        <div className="stat-card tertiary">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <p className="stat-label">Rank</p>
            <h2 className="stat-value">—</h2>
            <p className="text-muted" style={{ marginTop: 6 }}>
              (needs leaderboard endpoint)
            </p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">
            <Activity />
          </div>
          <div className="stat-content">
            <p className="stat-label">Recent Actions</p>
            <h2 className="stat-value">{recentActions.length}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Badge Progress</h3>
            <p>Next: {badgeInfo.next_badge || "Max Level"}</p>
          </div>

          <div className="card-content">
            <div className="progress-info">
              <span>{totalPoints} points</span>
              <span>{badgeInfo.next_badge_threshold || totalPoints} points</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${badgeProgress}%` }}
              />
            </div>

            <p className="progress-text" style={{ marginTop: 10 }}>
              {badgeInfo.next_badge
                ? `${Math.max(
                    0,
                    (badgeInfo.next_badge_threshold || 0) - totalPoints
                  )} points to ${badgeInfo.next_badge}`
                : "Maximum badge achieved! 🎉"}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Submissions</h3>
            <p>Last 5 actions</p>
          </div>

          <div className="card-content">
            {recentActions.length === 0 ? (
              <div className="empty-state">
                <p>No actions submitted yet</p>
                <p className="text-muted">Submit your first action to get started!</p>
              </div>
            ) : (
              <div className="actions-list">
                {recentActions.map((action) => {
                  const created = action.createdAt || action.created_at;
                  const typeId =
                    action.actionTypeId ||
                    action.action_type_id ||
                    action.ActionTypeId;

                  const type = action.ActionType || actionTypes[typeId];

                  return (
                    <div key={action.id} className="action-item">
                      <div className="action-info">
                        <h4>{type?.title || "Action"}</h4>
                        <p className="action-date">
                          {created
                            ? new Date(created).toLocaleDateString("en-GB")
                            : "—"}
                        </p>
                      </div>

                      <span className={`status-badge status-${action.status}`}>
                        {action.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}