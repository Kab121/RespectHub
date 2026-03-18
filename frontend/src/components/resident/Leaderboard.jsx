import React, { useState, useEffect } from "react";
import { userAPI } from "../../services/api.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import { Trophy, Medal, Award } from "lucide-react";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await userAPI.getLeaderboard();
      const data = Array.isArray(response.data) ? response.data : [];

      // sort highest points first
      data.sort((a, b) => Number(b.pointsTotal || 0) - Number(a.pointsTotal || 0));

      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (member) => {
    return member.fullName || member.name || "Unknown Resident";
  };

  const getPoints = (member) => {
    return Number(member.pointsTotal ?? member.total_points ?? 0);
  };

  const getBadgeName = (points) => {
    if (points >= 1000) return "Diamond";
    if (points >= 500) return "Platinum";
    if (points >= 250) return "Gold";
    if (points >= 100) return "Silver";
    return "Bronze";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="medal gold" />;
    if (rank === 2) return <Medal className="medal silver" />;
    if (rank === 3) return <Medal className="medal bronze" />;
    return <Award className="medal default" />;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const currentUserId = user?.id;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Community Leaderboard 🏆</h1>
        <p>See how residents rank by earned points and badges</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>No rankings available yet</p>
          <p className="text-muted">Be the first to earn points!</p>
        </div>
      ) : (
        <div className="leaderboard-container">
          <div className="leaderboard-list">
            <div className="list-header">
              <span>Rank</span>
              <span>Resident</span>
              <span>Badge</span>
              <span>Points</span>
            </div>

            {leaderboard.map((member, index) => {
              const displayName = getDisplayName(member);
              const points = getPoints(member);
              const badge = getBadgeName(points);
              const rank = index + 1;

              return (
                <div
                  key={member.id}
                  className={`list-item ${
                    member.id === currentUserId ? "current-user" : ""
                  }`}
                >
                  <div className="rank" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {getRankIcon(rank)}
                    <span>#{rank}</span>
                  </div>

                  <div className="member-info">
                    <div className="member-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="member-name">{displayName}</p>
                    </div>
                  </div>

                  <span className="badge-name">{badge}</span>
                  <span className="points">{points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}