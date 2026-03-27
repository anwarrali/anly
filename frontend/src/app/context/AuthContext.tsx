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

/**
 * Fetch the user's role from the `profiles` table.
 * Falls back to auth metadata if profiles table doesn't exist or has no row.
 */
async function fetchProfileRole(userId: string, fallbackRole: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data?.role) {
      console.log("[Auth] Role from profiles table:", data.role);
      return data.role;
    }
  } catch (err) {
    // profiles table may not exist — fall through to metadata
    console.log("[Auth] Could not read profiles table, using metadata role");
  }
  return fallbackRole;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = async (supabaseUser: any): Promise<User> => {
    // 1. Get role from auth metadata as default
    const metadataRole = supabaseUser.user_metadata?.role
      || supabaseUser.app_metadata?.role
      || "client";

    // 2. Try to get role from profiles table (source of truth)
    const dbRole = await fetchProfileRole(supabaseUser.id, metadataRole);

    console.log("[Auth] User Debug:", {
      id: supabaseUser.id,
      email: supabaseUser.email,
      metadata_role: metadataRole,
      db_role: dbRole,
      final_role: dbRole,
    });

    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || "User",
      email: supabaseUser.email || "",
      role: (dbRole?.toLowerCase() === "admin") ? "admin" : "client",
      avatar_url: supabaseUser.user_metadata?.avatar_url,
      email_confirmed_at: supabaseUser.email_confirmed_at
    };
  };

  const refreshUser = useCallback(async () => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) {
      const mapped = await mapUser(sbUser);
      setUser(mapped);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setToken(session.access_token);
          const mapped = await mapUser(session.user);
          setUser(mapped);
        }
      } catch (err) {
        console.error("[Auth] Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setToken(session?.access_token || null);
      if (session && session.user) {
        try {
          const mapped = await mapUser(session.user);
          setUser(mapped);
        } catch (err) {
          console.error("[Auth] onAuthStateChange update error:", err);
        }
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

    return await mapUser(data.user);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
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
          data: { name, role: "client" },
          emailRedirectTo: window.location.origin + "/login"
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error("Registration failed");

      return await mapUser(data.user);
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

