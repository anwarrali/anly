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
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
