/**
 * app/components/auth/GuestRoute.tsx
 * Redirects already-logged-in users away from login/register pages.
 */

import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
