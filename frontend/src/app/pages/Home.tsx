import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, Link } from "react-router";

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
  Settings,
  Palette,
  Grid3X3,
  TrendingUp,
  Download,
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";
import ThreeScene from "../components/ui/ThreeScene";

const featureIcons = [Zap, Globe, Shield, Headphones, Search, Smartphone];

export default function Home() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const navigate = useNavigate();

  const optName = (id: string | null) => {
    if (!id) return "";
    const opt = t.services.options.find((o) => o.id === id);
    return opt ? opt.name : id;
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-quart" });
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
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="overflow-x-hidden bg-background text-foreground">
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[130px] translate-y-1/3 -translate-x-1/4" />

          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <ThreeScene />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-start">
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-8 tracking-tighter"
              >
                {t.hero.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0 font-medium"
              >
                {t.hero.subtitle}
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex flex-wrap justify-center lg:justify-start gap-6 mb-16"
              >
                <Link
                  to="/templates"
                  className="px-10 py-5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)] hover:-translate-y-1 transition-all duration-300"
                >
                  {t.hero.cta}
                </Link>
                <Link
                  to="/services"
                  className="px-10 py-5 border-2 border-border text-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-muted transition-all duration-300 backdrop-blur-sm"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>

              {/* Stats */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-wrap justify-center lg:justify-start gap-12"
              >
                {[
                  t.hero.stats.templates,
                  t.hero.stats.clients,
                  t.hero.stats.satisfaction,
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1 relative">
                    <div className="absolute -left-4 top-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
                    <span className="text-3xl font-black text-foreground tracking-tighter">
                      {stat.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                      {stat.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div
              data-aos="zoom-out-up"
              data-aos-delay="200"
              className="relative hidden lg:block"
            >
              <div className="relative group">
                {/* Large Background Glow */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/30 to-accent/20 rounded-[3rem] blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative bg-[#050505] rounded-[3rem] p-4 border border-white/10 shadow-3xl transform group-hover:rotate-1 group-hover:scale-[1.02] transition-all duration-700 overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-8 py-5 bg-white/5 border-b border-white/5 mb-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 mx-10 px-4 py-2 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-[0.3em] text-center border border-white/5">
                      production.anly.io
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"
                      alt="Hero interface"
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Floating cards UI */}
                  <div className="absolute top-1/4 -left-12 bg-white rounded-3xl p-6 shadow-4xl flex items-center gap-5 border border-white/20 animate-float">
                    <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">
                        LIVE STATUS
                      </p>
                      <p className="text-lg font-black text-gray-900 leading-tight">
                        Order #8824
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-16 -right-12 bg-accent rounded-3xl p-6 shadow-4xl border border-white/30 transform rotate-3 animate-float-delayed">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-white text-white"
                        />
                      ))}
                    </div>
                    <p className="text-xs font-black text-white uppercase tracking-[0.2em]">
                      Verified Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES SHOWCASE (MOVED UP) ───────────── */}
      <section className="py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <div
                data-aos="fade-right"
                className="text-accent text-xs font-black uppercase tracking-[0.4em] mb-4"
              >
                Curated Collections
              </div>
              <h2
                data-aos="fade-right"
                data-aos-delay="100"
                className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter leading-none"
              >
                {t.templates.title}{" "}
                <span className="text-primary">
                  {t.templates.titleHighlight}
                </span>
              </h2>
            </div>
            <Link
              data-aos="fade-left"
              to="/templates"
              className="group flex items-center gap-4 px-8 py-4 bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
            >
              {t.templates.viewAll}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </div>

          <div className="md:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 animate-pulse select-none w-full">
            {lang === "ar" ? "اسحب للتصفح" : "Swipe to explore"} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
          </div>
          <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {dbTemplates.slice(0, 6).map((tpl: any, i: number) => {
              const colors = [
                "from-blue-500/20 to-cyan-500/20",
                "from-purple-500/20 to-pink-500/20",
                "from-amber-500/20 to-orange-500/20",
                "from-emerald-500/20 to-teal-500/20",
                "from-red-500/20 to-rose-500/20",
              ];
              const glowColor = colors[i % colors.length];

              return (
                <div
                  key={tpl._id || tpl.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group relative w-[85vw] md:w-auto flex-shrink-0 snap-center"
                >
                  <div className="relative bg-card rounded-[2.5rem] p-3 border border-border overflow-hidden transition-all duration-500 hover:border-primary/50 hover:scale-[1.01] shadow-sm h-full">
                    {/* Image wrapper */}
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted">
                      <img
                        src={tpl.image || tpl.previewImages?.[0]}
                        alt={tpl.title || tpl.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                        <Link
                          to={`/templates/${tpl._id || tpl.id}`}
                          className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-center hover:bg-accent transition-colors"
                        >
                          {t.templates.preview}
                        </Link>
                      </div>
                      {/* Floating label */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {tpl.isFeatured && (
                          <span className="px-4 py-1.5 bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl backdrop-blur-md">
                            Diamond Grade
                          </span>
                        )}
                        {tpl.type === "dashboard" && (
                          <span className="px-4 py-1.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl backdrop-blur-md">
                            Enterprise
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex flex-col items-center text-center mb-8">
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 mb-2">
                          {lang === "ar"
                            ? tpl.titleAr ||
                              tpl.nameAr ||
                              tpl.title ||
                              tpl.name
                            : tpl.title || tpl.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((j) => (
                              <div
                                key={j}
                                className="w-5 h-5 rounded-full border-2 border-card bg-muted flex items-center justify-center"
                              >
                                <Star
                                  size={8}
                                  className="fill-accent text-accent"
                                />
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {tpl.rating} Rating
                          </span>
                        </div>
                        <div className="text-3xl font-black text-primary tracking-tighter">
                          ${tpl.price}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link
                          to={`/order?templateId=${tpl._id || tpl.id}&type=template_purchase`}
                          className="flex-1 flex items-center justify-center py-5 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300"
                        >
                          {t.templates.buyNow}
                        </Link>
                        <button
                          onClick={async () => {
                            try {
                              const imgUrl = tpl.image || tpl.previewImages?.[0];
                              const response = await fetch(imgUrl);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${tpl.title || tpl.name}.jpg`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Download failed', error);
                              window.open(tpl.image || tpl.previewImages?.[0], '_blank');
                            }
                          }}
                          className="p-5 bg-blue-500/10 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Test Download"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ───────────────────────────────── */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <h2
              data-aos="fade-up"
              className="text-5xl sm:text-6xl font-black text-foreground mb-8 tracking-tighter"
            >
              {t.services.title}{" "}
              <span className="text-primary">{t.services.titleHighlight}</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6 font-medium"
            >
              {t.services.subtitle}
            </p>
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className="inline-block px-6 py-2 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-[0.4em]"
            >
              {t.pricing.planNotice}
            </div>
          </div>

          {!activePath ? (
            <>
              <div className="md:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 animate-pulse select-none w-full">
                {lang === "ar" ? "اسحب للتصفح" : "Swipe to explore"} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
              </div>
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-8 md:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {t.services.options.map((opt, i) => (
                <div
                  key={opt.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group relative p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-4xl hover:-translate-y-4 w-[85vw] md:w-auto flex-shrink-0 snap-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-primary text-primary-foreground flex items-center justify-center mb-8 md:mb-10 shadow-glow group-hover:scale-110 transition-transform duration-500">
                    {opt.id === "template" && <Grid3X3 size={40} />}
                    {opt.id === "setup" && <Settings size={40} />}
                    {opt.id === "custom" && <Palette size={40} />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4 md:mb-6 tracking-tight">
                    {opt.name}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 md:mb-10 font-medium">
                    {opt.description}
                  </p>
                  <div className="space-y-4 md:space-y-5 mb-10 md:mb-14">
                    {opt.features.map((feat, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check
                            size={12}
                            className="text-primary"
                            strokeWidth={4}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground/80">
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
                    className="w-full py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] bg-primary/10 text-primary border border-primary/20 rounded-3xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-lg"
                  >
                    {opt.cta}
                  </button>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div data-aos="fade-in">
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-4 bg-muted p-2 rounded-3xl border border-border">
                  <button
                    onClick={() => setActivePath(null)}
                    className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white rounded-2xl transition-all shadow-sm"
                  >
                    <ArrowRight size={16} className="rotate-180" />
                    {t.homeExtra.back}
                  </button>
                  <div className="h-6 w-px bg-border" />
                  <span className="px-6 py-3 text-sm font-black text-foreground uppercase tracking-tight">
                    {optName(activePath)} {t.homeExtra.plans}
                  </span>
                </div>
              </div>

              <div className="md:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 animate-pulse select-none w-full">
                {lang === "ar" ? "اسحب للتصفح" : "Swipe to explore"} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
              </div>
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-8 md:gap-10 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pt-10 pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide max-w-6xl mx-auto">
                {t.pricing.plans.map((plan, i) => (
                  <div
                    key={plan.id}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    className={`relative p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] border-2 transition-all duration-500 hover:-translate-y-3 w-[85vw] md:w-auto flex-shrink-0 snap-center ${
                      plan.popular
                        ? "border-primary bg-card shadow-glow-primary"
                        : "border-border bg-card/60 hover:border-primary/40 backdrop-blur-sm"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl z-20 whitespace-nowrap">
                        {t.homeExtra.mostPopular}
                      </div>
                    )}
                    <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase mb-8 tracking-[0.4em]">
                      {t.pricing.planNotice}
                    </p>
                    <p className="text-base text-muted-foreground mb-10 leading-relaxed font-medium">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-2 mb-12">
                      <span className="text-6xl font-black text-foreground tracking-tighter">
                        {plan.yearlyPrice}
                      </span>
                      <span className="text-muted-foreground font-black text-xs uppercase tracking-widest">
                        {t.homeExtra.perYear}
                      </span>
                    </div>

                    <div className="space-y-5 mb-16">
                      {plan.features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Check
                            size={20}
                            className="text-primary"
                            strokeWidth={4}
                          />
                          <span className="text-sm font-bold text-foreground">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/order?service=${activePath}&plan=${plan.id}`}
                      className={`w-full flex items-center justify-center py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 ${
                        plan.popular
                          ? "bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-[1.05]"
                          : "bg-foreground text-background hover:bg-primary hover:text-white"
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

      {/* ─── FEATURES (MOVED UNDER SERVICES) ───────── */}
      <section className="py-32 bg-card relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 px-4">
            <h2
              data-aos="fade-up"
              className="text-5xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter"
            >
              {t.features.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t.features.titleHighlight}
              </span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              {t.features.subtitle}
            </p>
          </div>

          <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {t.features.list.map((feature, i) => {
              const Icon = featureIcons[i] || Zap;
              const cardColors = [
                "hover:border-blue-500/30 hover:shadow-blue-500/10",
                "hover:border-green-500/30 hover:shadow-green-500/10",
                "hover:border-purple-500/30 hover:shadow-purple-500/10",
                "hover:border-red-500/30 hover:shadow-red-500/10",
                "hover:border-yellow-500/30 hover:shadow-yellow-500/10",
                "hover:border-cyan-500/30 hover:shadow-cyan-500/10",
              ];
              const iconBg = [
                "bg-blue-500/10 text-blue-500",
                "bg-green-500/10 text-green-500",
                "bg-purple-500/10 text-purple-500",
                "bg-red-500/10 text-red-500",
                "bg-yellow-500/10 text-yellow-500",
                "bg-cyan-500/10 text-cyan-500",
              ];

              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className={`group p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border/50 bg-background/50 backdrop-blur-xl transition-all duration-500 ${cardColors[i % 6]} hover:-translate-y-2 w-[85vw] md:w-auto flex-shrink-0 snap-center`}
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] ${iconBg[i % 6]} flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}
                  >
                    <Icon size={32} className="md:w-9 md:h-9" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-4 leading-tight tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="py-40 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[180px] translate-x-1/2 translate-y-1/2 animate-pulse-slow" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2
            data-aos="fade-up"
            className="text-6xl sm:text-8xl font-black text-white mb-10 tracking-tighter leading-none"
          >
            {t.cta.title}
            <br />
            <span className="text-accent underline decoration-white/20 underline-offset-8">
              {t.cta.titleHighlight}
            </span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-2xl text-white/80 mb-16 max-w-2xl mx-auto font-medium"
          >
            {t.cta.subtitle}
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-wrap justify-center gap-8"
          >
            <Link
              to="/templates"
              className="px-14 py-6 bg-white text-primary font-black uppercase tracking-[0.3em] text-xs rounded-3xl hover:bg-accent hover:text-white hover:scale-110 transition-all duration-500 shadow-4xl"
            >
              {t.homeExtra.getStarted}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
