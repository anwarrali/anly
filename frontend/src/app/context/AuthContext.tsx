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
  _id: string;
  name: string;
  email: string;
  role: "client" | "admin";
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
    const raw = localStorage.getItem("anly_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("anly_token"),
  );

  const persist = (token: string, user: User) => {
    localStorage.setItem("anly_token", token);
    localStorage.setItem("anly_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.data.token, data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      persist(data.data.token, data.data.user);
      return data.data.user;
    },
    [],
  );

  const logout = useCallback(() => {
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
