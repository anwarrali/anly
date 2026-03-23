import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect
} from "react";
import supabase from "../../utils/supabase";

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'client'
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
      if (session && session.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'client'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Login failed");
    
    const u: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || 'User',
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'client'
    };
    return u;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name, role: 'client' }
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error("Registration failed");
      
      const u: User = {
        id: data.user.id,
        name: data.user.user_metadata?.name || name,
        email: data.user.email || email,
        role: 'client'
      };
      return u;
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, []);

  if (loading) return null;

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
