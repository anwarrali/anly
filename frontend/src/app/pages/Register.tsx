/**
 * pages/Register.tsx
 * Premium register page — connects to POST /api/auth/register
 */

import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ArrowRight,
} from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Live password strength
  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0-4
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  // Tailwind colors for strength
  const getStrengthColor = (level: number) => {
    if (strength >= level) {
      switch (strength) {
        case 1:
          return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        case 2:
          return "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]";
        case 3:
          return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        case 4:
          return "bg-primary shadow-[0_0_10px_var(--primary)]";
        default:
          return "bg-muted-foreground/20";
      }
    }
    return "bg-muted-foreground/20";
  };

  const getLabelColor = () => {
    switch (strength) {
      case 1:
        return "text-red-500";
      case 2:
        return "text-orange-500";
      case 3:
        return "text-yellow-600 dark:text-yellow-500";
      case 4:
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const registeredUser = await register(name, email, password);
      if (registeredUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse">
      {/* Right side: Branding (Reversed for Register) */}
      <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-olive-500/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex justify-end">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight">Anly</span>
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-black text-xl rounded-xl">
              A
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md ml-auto text-right">
          <h1 className="text-4xl xl:text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
            Initialize your digital{" "}
            <span className="text-primary">infrastructure</span>.
          </h1>
          <p className="text-muted text-lg font-medium leading-relaxed mb-8">
            Establish your identity, unlock advanced tools, and scale your
            operations without friction.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/10 border border-border/10 text-xs font-black uppercase tracking-widest text-background backdrop-blur-md">
            New Deployment
          </div>
        </div>
      </div>

      {/* Left side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex lg:hidden items-center gap-3"
        >
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-lg">
            A
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            Anly
          </span>
        </Link>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-foreground tracking-tighter mb-3">
              Registration
            </h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              Establish new credentials
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="reg-name"
                className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1"
              >
                Full Identity
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="name"
                  className="w-full pl-12 pr-6 py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                  placeholder="Designated Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reg-email"
                className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1"
              >
                Communication Vector
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-6 py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                  placeholder="official@entity.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reg-password"
                className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1"
              >
                Security Passkey
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-14 py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="flex items-center justify-between mt-2 ml-1 mr-1">
                  <div className="flex gap-1.5 w-1/2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${getStrengthColor(n)}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${getLabelColor()}`}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reg-confirm"
                className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1"
              >
                Verify Passkey
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  id="reg-confirm"
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-14 py-4 bg-muted border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 transition-all font-medium ${confirm && confirm !== password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-primary/5"}`}
                  placeholder="Repeat sequence"
                />
                {confirm && confirm === password && (
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center text-primary pointer-events-none animate-in zoom-in">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg mt-8"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Allocate Resources
                  <ArrowRight size={18} strokeWidth={3} />
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-bold text-muted-foreground mt-4">
              By proceeding, you agree to our Terms of Protocol
            </p>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-muted-foreground">
            Entity already exists?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
