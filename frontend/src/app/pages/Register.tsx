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
import { useI18n } from "../../i18n";

export default function Register() {
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
  const strengthLabel = [
    "",
    t.auth.strength.weak,
    t.auth.strength.fair,
    t.auth.strength.good,
    t.auth.strength.strong,
  ][strength];

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
    setSuccess("");

    if (password !== confirm) {
      setError(t.auth.error.mismatch);
      return;
    }
    if (password.length < 8) {
      setError(t.auth.error.tooShort);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(lang === "ar" ? "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيله." : "Account created successfully! Please check your email to verify it.");
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || t.auth.error.failed);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };


  return (
    <div
      className={`min-h-screen bg-background flex ${lang === "ar" ? "flex-row" : "flex-row-reverse"}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Right side: Branding (Reversed for Register) */}
      <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-between p-12 relative overflow-hidden">
        <div
          className={`absolute top-0 ${lang === "ar" ? "right-0" : "left-0"} w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 ${lang === "ar" ? "translate-x-1/2" : "-translate-x-1/2"}`}
        />
        <div
          className={`absolute bottom-0 ${lang === "ar" ? "left-0" : "right-0"} w-96 h-96 bg-olive-500/20 rounded-full blur-[100px] translate-y-1/2 ${lang === "ar" ? "-translate-x-1/2" : "translate-x-1/2"}`}
        />

        <div className={`relative z-10 flex ${lang === "ar" ? "justify-start" : "justify-end"}`}>
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-background" dir="ltr">SeeV</span>
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-black text-xl rounded-xl">
              S
            </div>
          </Link>
        </div>

        <div className={`relative z-10 max-w-md ${lang === "ar" ? "mr-auto text-right" : "ml-auto text-left"}`}>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
            {t.auth.registerHeroTitle}{" "}
            <span className="text-primary">{t.auth.registerHeroHighlight}</span>.
          </h1>
          <p className="text-muted text-lg font-medium leading-relaxed mb-8 text-background/80">
            {t.auth.registerHeroSubtitle}
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/10 border border-border/10 text-xs font-black uppercase tracking-widest text-background backdrop-blur-md">
            {t.auth.newDeployment}
          </div>
        </div>
      </div>

      {/* Left side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <Link
          to="/"
          className={`absolute top-8 ${lang === "ar" ? "right-8" : "left-8"} flex lg:hidden items-center gap-3`}
        >
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-lg">
            S
          </div>
          <span className="text-xl font-black tracking-tight text-foreground" dir="ltr">
            SeeV
          </span>
        </Link>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 lg:mt-0">
          <div className={`mb-10 text-center ${lang === "ar" ? "lg:text-right" : "lg:text-left"}`}>
            <h2 className="text-3xl font-black text-foreground tracking-tighter mb-3">
              {t.auth.registerTitle}
            </h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              {t.auth.registerSubtitle}
            </p>
          </div>

          {error && (
            <div
              className={`flex items-center gap-3 p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold ${lang === "ar" ? "flex-row-reverse" : ""}`}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              className={`flex items-center gap-3 p-4 mb-8 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl text-sm font-bold ${lang === "ar" ? "flex-row-reverse" : ""}`}
            >
              <ShieldCheck size={18} />
              <span>{success}</span>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="reg-name"
                className={`text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "mr-1" : "ml-1"}`}
              >
                {t.auth.nameLabel}
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}
                >
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
                  className={`w-full ${lang === "ar" ? "pr-12 pl-6" : "pl-12 pr-6"} py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium`}
                  placeholder={t.auth.placeholder.name}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reg-email"
                className={`text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "mr-1" : "ml-1"}`}
              >
                {t.auth.emailLabel}
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}
                >
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
                  className={`w-full ${lang === "ar" ? "pr-12 pl-6" : "pl-12 pr-6"} py-4 bg-muted border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium`}
                  placeholder="contact@anly.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reg-password"
                className={`text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "mr-1" : "ml-1"}`}
              >
                {t.auth.passwordLabel}
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}
                >
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

              {password.length > 0 && (
                <div className={`flex items-center justify-between mt-2 ${lang === "ar" ? "mr-1 ml-1" : "ml-1 mr-1"}`}>
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
                className={`text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "mr-1" : "ml-1"}`}
              >
                {t.auth.confirmPasswordLabel}
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 ${lang === "ar" ? "right-0 pr-5" : "left-0 pl-5"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}
                >
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
                  className={`w-full ${lang === "ar" ? "pr-12 pl-14" : "pl-12 pr-14"} py-4 bg-muted border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 transition-all font-medium ${confirm && confirm !== password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-primary/5"}`}
                  placeholder="••••••••"
                />
                {confirm && confirm === password && (
                  <div
                    className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-5" : "right-0 pr-5"} flex items-center text-primary pointer-events-none animate-in zoom-in`}
                  >
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg mt-8 overflow-hidden relative"
            >
              {loading ? (
                <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>{t.auth.processing}</span>
                </div>
              ) : (
                <>
                  {t.auth.registerButton}
                  <ArrowRight size={18} strokeWidth={3} className={lang === "ar" ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.auth.or}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full mt-8 flex items-center justify-center gap-3 py-4 bg-card border border-border text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-muted transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {googleLoading ? (
               <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {t.auth.continueGoogle}
              </>
            )}
          </button>


          <p className="mt-10 text-center text-xs font-bold text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <Link
              to="/login"
              className="text-primary hover:underline underline-offset-4"
            >
              {t.auth.loginButton}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
