import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  Trophy,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Users,
  Star,
  CheckCircle2,
  BadgeCheck,
  LogIn,
  Menu,
  HeartHandshake,
  BarChart3,
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("respecthub_token", token);
      storage.setItem("respecthub_user", JSON.stringify(user));

      login(token, user);

      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="respecthub-landing-page">
      <div className="respecthub-landing-shell">
        <header className="respecthub-topbar">
          <div className="respecthub-brand">
            <div className="respecthub-brand-mark">R</div>
            <div>
              <h1>RespectHub</h1>
              <p>Community Recognition Platform</p>
            </div>
          </div>

          <nav className="respecthub-topnav">
            <a href="#features">Features</a>
            <a href="#impact">Impact</a>
            <a href="#login-section">Login</a>
            <Link to="/register" className="respecthub-nav-btn">
              Register
            </Link>
          </nav>

          <button className="respecthub-mobile-menu" type="button" aria-label="Menu">
            <Menu size={20} />
          </button>
        </header>

        <main className="respecthub-hero-layout">
          <section className="respecthub-hero-left">
            <div className="respecthub-hero-copy">
              <div className="respecthub-hero-pill">
                <Sparkles size={16} />
                <span>Build stronger neighbourhood engagement</span>
              </div>

              <h2>
                Reward positive community actions with a modern digital platform.
              </h2>

              <p>
                RespectHub helps residents submit meaningful local actions, earn
                points, unlock badges, and contribute to a verified, trusted,
                and more active neighbourhood community.
              </p>

              <div className="respecthub-hero-actions">
                <Link to="/register" className="respecthub-btn respecthub-btn-dark">
                  Get Started <ArrowRight size={18} />
                </Link>

                <a href="#features" className="respecthub-btn respecthub-btn-light">
                  Explore Platform
                </a>
              </div>

              <div className="respecthub-trust-row">
                <div className="respecthub-trust-item">
                  <ShieldCheck size={18} />
                  <span>Verified submissions</span>
                </div>
                <div className="respecthub-trust-item">
                  <Trophy size={18} />
                  <span>Rewards and badges</span>
                </div>
                <div className="respecthub-trust-item">
                  <MapPin size={18} />
                  <span>Local impact tracking</span>
                </div>
              </div>
            </div>

            <div className="respecthub-hero-visual">
              <div className="respecthub-visual-board">
                <div className="respecthub-photo-panel">
                  <img
                    src="https://img.freepik.com/premium-vector/community-care-icons-team-help-illustration_911078-7846.jpg"
                    alt="Community member"
                  />
                </div>

                <div className="respecthub-circle-cta">
                  <span>Explore</span>
                  <span>Local Impact</span>
                  <ArrowRight size={18} />
                </div>

                <div className="respecthub-avatar-stack">
                  <div className="avatar-dot">M</div>
                  <div className="avatar-dot">A</div>
                  <div className="avatar-dot">S</div>
                </div>

                <div className="respecthub-floating-stat stat-yellow">
                  <span>Total Community Actions</span>
                  <strong>5000+</strong>
                </div>

                <div className="respecthub-floating-stat stat-black">
                  <span>Daily New Reviews</span>
                  <strong>54</strong>
                </div>

                <div className="respecthub-floating-stat stat-gold">
                  <span>Verified Contributions This Year</span>
                  <strong>2.5K</strong>
                </div>
              </div>
            </div>

            <div className="respecthub-bottom-cards" id="impact">
              <div className="impact-card impact-card-dark">
                <HeartHandshake size={20} />
                <div>
                  <strong>Neighbourhood Engagement</strong>
                  <p>Encourage residents to contribute positive local actions.</p>
                </div>
              </div>

              <div className="impact-card">
                <BadgeCheck size={20} />
                <div>
                  <strong>Trusted Recognition</strong>
                  <p>Admin-reviewed submissions help maintain quality and trust.</p>
                </div>
              </div>

              <div className="impact-card">
                <BarChart3 size={20} />
                <div>
                  <strong>Visible Local Impact</strong>
                  <p>Track actions, approvals, rankings, rewards, and progress.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="respecthub-hero-right" id="login-section">
            <div className="respecthub-login-card">
              <div className="respecthub-login-header">
                <div className="respecthub-login-icon">
                  <LogIn size={28} />
                </div>
                <h3>Welcome Back</h3>
                <p>Sign in to continue your RespectHub journey</p>
              </div>

              <div className="respecthub-mini-metrics">
                <div className="mini-metric">
                  <Users size={16} />
                  <span>Residents</span>
                </div>
                <div className="mini-metric">
                  <CheckCircle2 size={16} />
                  <span>Approved Actions</span>
                </div>
                <div className="mini-metric">
                  <Star size={16} />
                  <span>Leaderboard</span>
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

                    <Link to="#" className="auth-link-subtle">
                      Forgot?
                    </Link>
                  </label>

                  <div className="auth-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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

              <div className="respecthub-login-features" id="features">
                <div className="login-feature-card">
                  <ClipboardCheck size={18} />
                  <div>
                    <strong>Track submissions</strong>
                    <p>Monitor approval status and community activity history.</p>
                  </div>
                </div>

                <div className="login-feature-card">
                  <Trophy size={18} />
                  <div>
                    <strong>Earn badges</strong>
                    <p>Unlock recognition based on approved positive actions.</p>
                  </div>
                </div>

                <div className="login-feature-card">
                  <MapPin size={18} />
                  <div>
                    <strong>Support local impact</strong>
                    <p>Encourage real contributions across your neighbourhood.</p>
                  </div>
                </div>
              </div>

              <div className="auth-footer">
                <p>
                  Don&apos;t have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}