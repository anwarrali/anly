import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import Services from "./pages/Services";
import Order from "./pages/Order";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "templates", Component: Templates },
      { path: "templates/:id", Component: TemplateDetail },
      { path: "services", Component: Services },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },

      // Guest-only routes (redirect to /dashboard if already logged in)
      {
        element: <GuestRoute />,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },

      // Protected routes (require login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "order", Component: Order },
          { path: "dashboard", Component: Dashboard },
        ],
      },

      // Admin-only routes
      {
        element: <ProtectedRoute requireAdmin />,
        children: [{ path: "admin", Component: Admin }],
      },
    ],
  },
]);
