import { Link } from "react-router";
import { Twitter, Github, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useI18n } from "../../../i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl transition-transform group-hover:scale-110">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                ANLY
              </span>
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-8 max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <Icon size={18} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              {t.footer.product}
            </h4>
            <ul className="space-y-4">
              {[
                { label: t.footer.links.templates, href: "/templates" },
                { label: t.footer.links.services, href: "/services" },
                { label: t.footer.links.pricing, href: "/#pricing" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm font-bold text-white/60 hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              {t.footer.company}
            </h4>
            <ul className="space-y-4">
              {[
                { label: t.footer.links.about, href: "/about" },
                { label: t.footer.links.contact, href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm font-bold text-white/60 hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom */}
        <div className="py-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
