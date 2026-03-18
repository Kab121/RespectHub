import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.jsx";
import {
  LogOut,
  Home,
  Trophy,
  Send,
  ListChecks,
  BarChart3,
  Users,
} from "lucide-react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const residentLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/submit", icon: Send, label: "Submit Action" },
    { to: "/my-actions", icon: ListChecks, label: "My Actions" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const adminLinks = [
    { to: "/admin", icon: BarChart3, label: "Dashboard" },
    { to: "/admin/review", icon: ListChecks, label: "Review Queue" },
    { to: "/admin/leaderboard", icon: Users, label: "Leaderboard" },
  ];

  const links = user?.role === "admin" ? adminLinks : residentLinks;

  const displayName = user?.fullName || user?.name || "User";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">RespectHub</h1>
          <p className="logo-subtitle">Community Recognition</p>
        </div>

        <div className="nav-links">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className={`user-info ${user?.role || ""}`}>
            <div className="user-avatar">{displayInitial}</div>

            <div className="user-details">
              <p className="user-name">{displayName}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}