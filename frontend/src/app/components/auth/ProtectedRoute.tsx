/**
 * app/components/auth/ProtectedRoute.tsx
 * Wraps a route: redirects to /login if user is not authenticated.
 * Pass requireAdmin={true} to also require admin role.
 */

import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface Props {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: Props) {
  const { isAuthenticated, isAdmin, isEmailVerified } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    // Optionally redirect to a 'verify-email' page, but for now /login with an error message
    return <Navigate to="/login" state={{ error: "Please verify your email." }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

