import { Link } from "react-router";
import { Twitter, Github, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useI18n } from "../../../i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl transition-transform group-hover:scale-110">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-background">
                ANLY
              </span>
            </Link>
            <p className="text-muted text-sm font-medium leading-relaxed mb-8 max-w-sm">
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
                  className="w-10 h-10 rounded-lg bg-background/5 border border-border/10 flex items-center justify-center text-muted hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300"
                >
                  <Icon size={18} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-background text-xs font-black uppercase tracking-widest mb-6">
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
                    className="text-sm font-bold text-muted hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background text-xs font-black uppercase tracking-widest mb-6">
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
                    className="text-sm font-bold text-muted hover:text-primary transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-12 border-t border-border/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-background/5 border border-border/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-black text-background tracking-tight mb-2">
                Operational Intelligence
              </h4>
              <p className="text-sm font-medium text-muted">
                Receive crucial deployment updates and strategic insights
                directly to your comms vector.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Identify your email..."
                className="w-full sm:w-72 px-5 py-4 bg-background border border-border/10 rounded-xl text-sm font-medium text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-transform">
                Patch In <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-muted uppercase tracking-widest">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors"
            >
              {t.footer.privacy}
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors"
            >
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
