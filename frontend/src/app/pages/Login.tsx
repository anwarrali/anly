/**
 * pages/Login.tsx
 * Premium login page — connects to POST /api/auth/login
 */

import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

import { useI18n } from "../../i18n";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (lang === "ar"
            ? "فشل تسجيل الدخول. يرجى التحقق من بياناتك."
            : "Login failed. Please check your credentials."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Left side: Branding */}
      <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-olive-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-black text-xl rounded-xl">
              A
            </div>
            <span className="text-2xl font-black tracking-tight">Anly</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
            {t.auth.loginHeroTitle}{" "}
            <span className="text-primary">{t.auth.loginHeroHighlight}</span>.
          </h1>
          <p className="text-muted text-lg font-medium leading-relaxed mb-8">
            {t.auth.loginHeroSubtitle}
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/10 border border-border/10 text-xs font-black uppercase tracking-widest text-background backdrop-blur-md">
            {t.auth.securePortal}
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <Link
          to="/"
          className={`absolute top-8 ${lang === "ar" ? "right-8" : "left-8"} flex lg:hidden items-center gap-3`}
        >
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-lg">
            A
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            Anly
          </span>
        </Link>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className={`mb-10 text-center ${lang === "ar" ? "lg:text-right" : "lg:text-left"}`}>
            <h2 className="text-3xl font-black text-foreground tracking-tighter mb-3">
              {t.auth.loginTitle}
            </h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              {t.auth.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className={`flex items-center gap-3 p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold ${lang === "ar" ? "flex-row-reverse" : ""}`}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className={`text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "mr-1" : "ml-1"}`}
              >
                {t.auth.emailLabel}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}>
                  <Mail size={18} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="email"
                  className={`w-full ${lang === "ar" ? "pr-12 pl-6" : "pl-12 pr-6"} py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium`}
                  placeholder="contact@anly.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center justify-between ${lang === "ar" ? "mr-1" : "ml-1"} leading-none`}>
                <label
                  htmlFor="login-password"
                  className="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                >
                  {t.auth.passwordLabel}
                </label>
              </div>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}>
                  <Lock size={18} />
                </div>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  autoComplete="current-password"
                  className={`w-full ${lang === "ar" ? "pr-12 pl-14" : "pl-12 pr-14"} py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-5" : "right-0 pr-5"} flex items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none`}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  {t.auth.verifying}
                </>
              ) : (
                <>
                  {t.auth.loginButton}
                  <ArrowRight size={18} strokeWidth={3} className={lang === "ar" ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-xs font-bold text-muted-foreground">
            {t.auth.noAccount}{" "}
            <Link
              to="/register"
              className="text-primary hover:underline underline-offset-4"
            >
              {t.auth.registerButton}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
