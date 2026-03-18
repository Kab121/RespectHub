import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { UserPlus, Mail, Lock, User, Home as HomeIcon } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    flatNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (key) => (e) => {
    setFormData((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Send payload exactly like your successful curl test
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        flatNumber: formData.flatNumber.trim(),
      };

      const res = await authAPI.register(payload);

      // Your backend currently returns: { message:"Registered", userId:2 }
      // It DOES NOT return token, so we just redirect to login.
      alert("✅ Registered successfully! Please login now.");
      navigate("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={32} />
          </div>
          <h1>Join RespectHub</h1>
          <p>Create your account to start earning respect points</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>
              <User size={18} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={onChange("fullName")}
              placeholder="Test User"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={onChange("email")}
              placeholder="test2@respecthub.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={onChange("password")}
              placeholder="Test123!"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>
              <HomeIcon size={18} />
              <span>Flat Number</span>
            </label>
            <input
              type="text"
              value={formData.flatNumber}
              onChange={onChange("flatNumber")}
              placeholder="A-101"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
