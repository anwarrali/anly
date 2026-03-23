/**
 * app/context/AuthContext.tsx
 * Global auth state: user, token, login, logout helpers.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import api from "../../utils/api";

interface User {
  id: string; // Changed from _id to id for PostgreSQL/Supabase consistency
  name: string;
  email: string;
  role: "client" | "admin";
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem("seev_user") || localStorage.getItem("anly_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("seev_token") || localStorage.getItem("anly_token"),
  );

  const persist = (token: string, user: User) => {
    localStorage.setItem("seev_token", token);
    localStorage.setItem("seev_user", JSON.stringify(user));
    // Clean up old keys
    localStorage.removeItem("anly_token");
    localStorage.removeItem("anly_user");
    
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { data: content } = response.data;
    persist(content.token, content.user);
    return content.user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      // response.data is the backend json: { success, data: { user, token } }
      const { data: content } = response.data;
      persist(content.token, content.user);
      return content.user;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("seev_token");
    localStorage.removeItem("seev_user");
    localStorage.removeItem("anly_token");
    localStorage.removeItem("anly_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
