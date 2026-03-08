import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, Link } from "react-router"; // Add useNavigate to the import

import {
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Headphones,
  Search,
  Star,
  Check,
  ChevronRight,
  Play,
  Settings,
  Palette,
  Grid3X3,
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";

const featureIcons = [Zap, Globe, Shield, Headphones, Search, Smartphone];

export default function Home() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [activePath, setActivePath] = useState<string | null>(null);
  const navigate = useNavigate();
  const optName = (id: string | null) => {
    if (!id) return "";
    const opt = t.services.options.find((o) => o.id === id);
    return opt ? opt.name : id;
  };

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates");
      const list = res.data?.data?.templates || res.data?.data || [];
      const templatesArray = Array.isArray(list) ? list : [];
      setDbTemplates(templatesArray);

      setTimeout(() => {
        AOS.refresh();
      }, 100);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 bg-background overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olive-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(var(--olive-400) 0.5px, transparent 0.5px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-8"
              >
                {t.hero.title}
                <br />
                <span className="text-primary">{t.hero.titleHighlight}</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
              >
                {t.hero.subtitle}
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex flex-wrap gap-4 mb-14"
              >
                <Link
                  to="/templates"
                  className="px-8 py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {t.hero.cta}
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 border border-border text-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-muted transition-all duration-300"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>

              {/* Stats */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-wrap gap-10"
              >
                {[
                  t.hero.stats.templates,
                  t.hero.stats.clients,
                  t.hero.stats.satisfaction,
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-foreground">
                      {stat.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      {stat.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-3xl scale-105" />
                <div className="relative bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-6 py-4 bg-muted/50 border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="flex-1 mx-6 px-4 py-1.5 bg-background rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                      my.anly.io
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1583932692875-a42450d50acf?w=700&q=80"
                    alt="Dashboard preview"
                    className="w-full h-72 object-cover"
                  />
                  {/* Floating cards */}
                  <div className="absolute top-20 -left-10 bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-bounce-slow">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Check
                        size={20}
                        className="text-primary"
                        strokeWidth={3}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Processing
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        Order #1284
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-10 -right-10 bg-card border border-border rounded-2xl shadow-2xl p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-xs font-black text-foreground uppercase tracking-widest">
                      Trusted Branding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      </section>

      {/* ─── FEATURES ───────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2
              data-aos="fade-up"
              className="text-4xl font-extrabold text-foreground mb-4 tracking-tight"
            >
              {t.features.title}{" "}
              <span className="text-primary">{t.features.titleHighlight}</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.list.map((feature, i) => {
              const Icon = featureIcons[i] || Zap;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="group p-8 rounded-2xl border border-transparent hover:border-border hover:bg-background transition-all duration-300 bg-muted/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES SHOWCASE ──────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-14">
            <div>
              <h2
                data-aos="fade-right"
                className="text-4xl font-extrabold text-foreground tracking-tight"
              >
                {t.templates.title}{" "}
                <span className="text-primary">
                  {t.templates.titleHighlight}
                </span>
              </h2>
              <p
                data-aos="fade-right"
                data-aos-delay="100"
                className="text-muted-foreground mt-2"
              >
                {t.templates.subtitle}
              </p>
            </div>
            <Link
              data-aos="fade-left"
              to="/templates"
              className="group flex items-center gap-2 px-6 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-all duration-200 whitespace-nowrap"
            >
              {t.templates.viewAll}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbTemplates.slice(0, 6).map((tpl: any, i: number) => (
              <div
                key={tpl._id || tpl.id}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:shadow-olive-200/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={tpl.image || tpl.previewImages?.[0]}
                    alt={
                      lang === "ar"
                        ? tpl.titleAr || tpl.nameAr || tpl.title || tpl.name
                        : tpl.title || tpl.name
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Link
                      to={`/templates/${tpl._id || tpl.id}`}
                      className="flex-1 text-center py-2.5 bg-card text-foreground text-xs font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {t.templates.preview}
                    </Link>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-4 start-4 flex gap-2">
                    {tpl.isFeatured && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {lang === "ar"
                          ? tpl.titleAr || tpl.nameAr || tpl.title || tpl.name
                          : tpl.title || tpl.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="text-xs text-foreground font-bold">
                          {(tpl.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-black text-primary">
                      ${tpl.price}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8 h-8 overflow-hidden">
                    {tpl.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/order?templateId=${tpl._id || tpl.id}&type=template_purchase`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    {t.templates.buyNow}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ───────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2
              data-aos="fade-up"
              className="text-4xl font-extrabold text-foreground mb-4 tracking-tight"
            >
              {t.services.title}{" "}
              <span className="text-primary">{t.services.titleHighlight}</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            >
              {t.services.subtitle}
            </p>
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              className="text-xs font-bold text-primary uppercase tracking-[0.2em]"
            >
              {t.pricing.planNotice}
            </p>
          </div>

          {!activePath ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {t.services.options.map((opt, i) => (
                <div
                  key={opt.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group relative p-10 rounded-[2.5rem] bg-muted/30 border border-transparent hover:border-border hover:bg-background transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-primary-foreground flex items-center justify-center mb-8 shadow-xl shadow-primary/10">
                    {opt.id === "template" && <Grid3X3 size={30} />}
                    {opt.id === "setup" && <Settings size={30} />}
                    {opt.id === "custom" && <Palette size={30} />}
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">
                    {opt.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {opt.description}
                  </p>
                  <div className="space-y-4 mb-10">
                    {opt.features.map((feat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check
                          size={16}
                          className="text-primary flex-shrink-0"
                          strokeWidth={3}
                        />
                        <span className="text-sm font-medium text-foreground/80">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      opt.id === "template"
                        ? navigate("/templates")
                        : setActivePath(opt.id)
                    }
                    className="w-full py-4 text-sm font-bold bg-muted text-foreground border border-border rounded-2xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    {opt.cta}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div data-aos="fade-in">
              <div className="flex items-center justify-center gap-4 mb-10">
                <button
                  onClick={() => setActivePath(null)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                  <ArrowRight size={14} className="rotate-180" />
                  {lang === "ar" ? "رجوع" : "Back"}
                </button>
                <div className="h-4 w-[2px] bg-border" />
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  {optName(activePath)} {lang === "ar" ? "خطط" : "Plans"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {t.pricing.plans.map((plan, i) => (
                  <div
                    key={plan.id}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    className={`relative p-10 rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl ${
                      plan.popular
                        ? "border-primary bg-background shadow-2xl shadow-primary/10"
                        : "border-border bg-muted/20 hover:border-primary/30"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                        {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
                      </div>
                    )}
                    <h3 className="text-2xl font-black text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase mb-6 tracking-widest">
                      {t.pricing.planNotice}
                    </p>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-10">
                      <span className="text-5xl font-black text-foreground tracking-tighter">
                        {plan.yearlyPrice}
                      </span>
                      <span className="text-muted-foreground font-bold text-sm uppercase">
                        {lang === "ar" ? "/سنوياً" : "/year"}
                      </span>
                    </div>

                    <div className="space-y-4 mb-12">
                      {plan.features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check
                            size={16}
                            className="text-primary flex-shrink-0"
                            strokeWidth={3}
                          />
                          <span className="text-sm font-medium text-foreground/80">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/order?service=${activePath}&plan=${plan.id}`}
                      className={`w-full flex items-center justify-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02]"
                          : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2
            data-aos="fade-up"
            className="text-4xl sm:text-6xl font-black text-primary-foreground mb-8 tracking-tighter"
          >
            {t.cta.title}{" "}
            <span className="text-olive-200">{t.cta.titleHighlight}</span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-xl text-primary-foreground/70 mb-14 max-w-2xl mx-auto"
          >
            {t.cta.subtitle}
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/templates"
              className="px-12 py-5 bg-card text-foreground font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-background hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
