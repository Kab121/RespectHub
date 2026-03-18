import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.jsx";
import Chatbot from "./Chatbot.jsx";
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

  // Resident links
  const residentLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/submit", icon: Send, label: "Submit Action" },
    { to: "/my-actions", icon: ListChecks, label: "My Actions" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  // Admin links
  const adminLinks = [
    { to: "/admin", icon: BarChart3, label: "Dashboard" },
    { to: "/admin/review", icon: ListChecks, label: "Review Queue" },
    { to: "/admin/leaderboard", icon: Users, label: "Leaderboard" },
  ];

  const links = user?.role === "admin" ? adminLinks : residentLinks;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">RespectHub</h1>
          <p className="logo-subtitle">Community Recognition</p>
        </div>

        {/* Navigation Links */}
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

        {/* User Info + Logout */}
        <div className="sidebar-footer">
          <div className={`user-info ${user?.role}`}>
            <div className="user-avatar">
              {(user?.fullName || user?.name || "?")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">
                {user?.fullName || user?.name || "User"}
              </p>
              <p className="user-role">{user?.role || "resident"}</p>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* ✅ Chatbot (Floating AI Assistant) */}
      <Chatbot />
    </div>
  );
}