import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  Trophy,
  ClipboardCheck,
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // AuthContext handles storage now
      login(token, user, rememberMe);

      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--premium">
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn size={30} />
          </div>

          <h1>Welcome to RespectHub</h1>
          <p>Sign in to your RespectHub account</p>

          <div className="auth-badges">
            <span className="auth-badge">
              <ShieldCheck size={16} />
              Verified reviews
            </span>
            <span className="auth-badge">
              <MapPin size={16} />
              Location-ready
            </span>
            <span className="auth-badge">
              <Trophy size={16} />
              Points & badges
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="your.email@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="auth-label-row">
              <span className="auth-label-left">
                <Lock size={18} />
                <span>Password</span>
              </span>

              <Link to="/forgot-password" className="auth-link-subtle">
                Forgot?
              </Link>
            </label>

            <div className="auth-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <span className="auth-mini-hint">Use on personal devices</span>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>What you can do after login</span>
        </div>

        <div className="auth-mini-features">
          <div className="auth-mini-item">
            <MapPin size={18} />
            <div>
              <strong>Report with live location</strong>
              <p>Submit actions from where you are.</p>
            </div>
          </div>

          <div className="auth-mini-item">
            <ClipboardCheck size={18} />
            <div>
              <strong>Track your submissions</strong>
              <p>See history & approval status.</p>
            </div>
          </div>

          <div className="auth-mini-item">
            <Trophy size={18} />
            <div>
              <strong>Earn points & badges</strong>
              <p>Progress, streaks and leaderboards.</p>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

      <div className="auth-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
}