import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useI18n } from "../../../i18n";

const noFooterPaths = ["/dashboard", "/admin", "/login", "/register"];
const noNavbarPaths = ["/admin", "/login", "/register"];

export function Layout() {
  const { isRTL } = useI18n();
  const location = useLocation();
  const showFooter = !noFooterPaths.some((p) =>
    location.pathname.startsWith(p),
  );
  const showNavbar = !noNavbarPaths.some((p) =>
    location.pathname.startsWith(p),
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
