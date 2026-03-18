import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // While checking auth
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  // Allowed
  return children;
}
