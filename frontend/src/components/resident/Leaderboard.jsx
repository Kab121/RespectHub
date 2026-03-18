import React, { useState, useEffect } from "react";
import { userAPI } from "../../services/api.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

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
      setLeaderboard(response.data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="medal gold" />;
      case 2:
        return <Medal className="medal silver" />;
      case 3:
        return <Medal className="medal bronze" />;
      default:
        return <Award className="medal default" />;
    }
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
        <p>See how you rank among community members</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>No rankings available yet</p>
          <p className="text-muted">Be the first to earn points!</p>
        </div>
      ) : (
        <div className="leaderboard-container">
          {/* Top 3 Podium */}
          <div className="podium">
            {leaderboard.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className={`podium-place place-${index + 1} ${
                  member.id === currentUserId ? "current-user" : ""
                }`}
              >
                <div className="podium-rank">{getMedalIcon(index + 1)}</div>
                <div className="podium-avatar">
                  {(member.name || "?").charAt(0).toUpperCase()}
                </div>
                <h3 className="podium-name">{member.name}</h3>
                <p className="podium-flat">{member.flat_number}</p>

                <div className="podium-stats">
                  <div className="stat">
                    <TrendingUp size={16} />
                    <span>{member.total_points} pts</span>
                  </div>
                  <div className="stat">
                    <Award size={16} />
                    <span>{member.current_badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rest of the leaderboard */}
          {leaderboard.length > 3 && (
            <div className="leaderboard-list">
              <div className="list-header">
                <span>Rank</span>
                <span>Resident</span>
                <span>Badge</span>
                <span>Points</span>
              </div>

              {leaderboard.slice(3).map((member, index) => (
                <div
                  key={member.id}
                  className={`list-item ${
                    member.id === currentUserId ? "current-user" : ""
                  }`}
                >
                  <span className="rank">#{index + 4}</span>

                  <div className="member-info">
                    <div className="member-avatar">
                      {(member.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="member-name">{member.name}</p>
                      <p className="member-flat">{member.flat_number}</p>
                    </div>
                  </div>

                  <span className="badge-name">{member.current_badge}</span>
                  <span className="points">{member.total_points}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
