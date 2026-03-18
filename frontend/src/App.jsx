import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";

import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import Layout from "./components/shared/Layout.jsx";

import ResidentDashboard from "./components/resident/ResidentDashboard.jsx";
import SubmitAction from "./components/resident/SubmitAction.jsx";
import MyActions from "./components/resident/MyActions.jsx";
import Leaderboard from "./components/resident/Leaderboard.jsx";

import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ReviewQueue from "./components/admin/ReviewQueue.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Resident */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="resident">
            <Layout>
              <ResidentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute requiredRole="resident">
            <Layout>
              <SubmitAction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-actions"
        element={
          <ProtectedRoute requiredRole="resident">
            <Layout>
              <MyActions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute requiredRole="resident">
            <Layout>
              <Leaderboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/review"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <ReviewQueue />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
