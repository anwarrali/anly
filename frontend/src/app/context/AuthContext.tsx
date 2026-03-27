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
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  avatar_url?: string;
  email_confirmed_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (supabaseUser: any): User => {
    // Priority: user_metadata.role > app_metadata.role > 'client'
    const role = supabaseUser.user_metadata?.role || supabaseUser.app_metadata?.role || 'client';
    
    // Debug log to help see what role is being detected
    console.log("Supabase Auth Metadata Debug:", {
      id: supabaseUser.id,
      user_metadata: supabaseUser.user_metadata,
      app_metadata: supabaseUser.app_metadata,
      final_role: role
    });

    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || 'User',
      email: supabaseUser.email || '',
      role: (role?.toLowerCase() === 'admin') ? 'admin' : 'client',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
      email_confirmed_at: supabaseUser.email_confirmed_at
    };
  };



  const refreshUser = useCallback(async () => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) {
      setUser(mapUser(sbUser));
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setUser(mapUser(session.user));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
      if (session && session.user) {
        setUser(mapUser(session.user));
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
    
    return mapUser(data.user);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      }
    });
    if (error) throw error;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name, role: 'client' },
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error("Registration failed");
      
      return mapUser(data.user);
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
        isEmailVerified: !!user?.email_confirmed_at,
        login,
        signInWithGoogle,
        register,
        logout,
        refreshUser,
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

