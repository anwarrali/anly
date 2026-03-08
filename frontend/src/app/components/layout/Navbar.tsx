import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Globe, ChevronDown, LogOut } from "lucide-react";
import { useI18n } from "../../../i18n";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Navbar() {
  const { t, lang, setLang, isRTL } = useI18n();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/templates", label: t.nav.templates },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg group-hover:shadow-olive-200/50 transition-all">
              <span className="text-primary-foreground text-sm font-bold">
                A
              </span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              AN<span className="text-primary">LY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-all border border-border"
            >
              <Globe size={15} />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 hover:shadow-lg transition-all"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t.nav.dashboard}
                    </Link>
                    <Link
                      to="/order"
                      className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {t.nav.getStarted}
                    </Link>
                  </>
                )}
                <button
                  onClick={logout}
                  className="ms-2 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Globe size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-semibold text-center bg-red-600 text-white"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {t.nav.dashboard}
                      </Link>
                      <Link
                        to="/order"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-center bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
                      >
                        {t.nav.getStarted}
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
