import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
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
import supabase from "../../utils/supabase";

const featureIcons = [Zap, Globe, Shield, Headphones, Search, Smartphone];

import { EyeLogo } from "../components/ui/EyeLogo";

export default function Home() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-quart" });
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data: list, error } = await supabase.from('templates').select('*');
      if (error) throw error;
      const templatesArray = Array.isArray(list) ? list : [];
      setDbTemplates(templatesArray);
      setTimeout(() => AOS.refresh(), 100);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const stats = [
    { value: "94%", label: lang === "ar" ? "الانطباعات الأولى تصميم" : "First impressions are design" },
    { value: "75%", label: lang === "ar" ? "يحكمون على المصداقية بالموقع" : "Judge credibility by website" },
    { value: "0.05s", label: lang === "ar" ? "لتكوين رأي" : "To form an opinion" },
  ];

  const optName = (id: string | null) => {
    if (!id) return "";
    const opt = t.services.options.find((o) => o.id === id);
    return opt ? opt.name : "";
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="overflow-x-hidden bg-background text-foreground">
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-start pt-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
           <div className="absolute inset-0" 
             style={{
               backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
               backgroundSize: '62px 62px',
               maskImage: 'radial-gradient(ellipse 75% 55% at 60% 50%, black 15%, transparent 80%)'
             }}
           />
          <div className="absolute top-12 right-[3%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-0 left-[-4%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full mt-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="text-center lg:text-start">
              <div 
                data-aos="fade-down" 
                className="inline-flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-accent"
              >
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {t.homeExtra.badge}
              </div>

              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase font-oswald"
              >
                {t.hero.title}
                <br />
                <span className="text-primary italic"> {t.hero.titleHighlight}</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0 font-medium"
              >
                {t.hero.subtitle}
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16"
              >
                <Link
                  to="/templates"
                  className="px-10 py-5 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-accent hover:text-white hover:shadow-glow-accent hover:-translate-y-1 transition-all duration-300"
                >
                  {t.hero.cta}
                </Link>
                <Link
                  to="/contact"
                  className="px-10 py-5 border border-border text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-muted transition-all duration-300 backdrop-blur-sm"
                >
                  {t.homeExtra.getQuote}
                </Link>
              </div>

              {/* Stats */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-wrap justify-center lg:justify-start gap-12 pt-10 border-t border-border"
              >
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-4xl font-black text-foreground tracking-tighter font-oswald flex items-baseline gap-1">
                      {stat.value.replace('%', '')}<span className="text-primary text-xl">%</span>
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Eye Animation */}
            <div data-aos="zoom-in" data-aos-delay="300" className="relative group flex justify-center items-center">
              <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
                <EyeLogo />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── TEMPLATES SHOWCASE (MOVED UP) ───────────── */}
      <section className="py-24 relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <div
                data-aos="fade-right"
                className="text-accent text-xs font-black uppercase tracking-[0.4em] mb-4"
              >
                {t.homeExtra.curatedCollections}
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-10">
            {dbTemplates.slice(0, 4).map((tpl: any, i: number) => {
              return (
                <Link
                  key={tpl._id || tpl.id}
                  to={`/templates/${tpl._id || tpl.id}`}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group relative w-full"
                >
                  <div className="relative bg-card rounded-[1.2rem] sm:rounded-[2rem] border border-border overflow-hidden transition-all duration-500 hover:border-primary/50 hover:scale-[1.01] shadow-sm h-full flex flex-col">
                    {/* Image wrapper */}
                    <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-muted m-1.5 sm:m-2">
                      <img
                        src={tpl.image_url || tpl.image || (Array.isArray(tpl.preview_images) ? tpl.preview_images[0] : null) || (Array.isArray(tpl.previewImages) ? tpl.previewImages[0] : null)}
                        alt={lang === 'ar' ? (tpl.title_ar || tpl.name_ar || tpl.nameAr || tpl.title) : (tpl.title || tpl.name)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay & Title */}
                      <div className="absolute inset-x-0 bottom-0 min-h-[50%] bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-6 md:p-8 flex flex-col justify-end">
                        <h3 
                          className="text-xs sm:text-lg md:text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight line-clamp-2 md:line-clamp-3 mb-1 sm:mb-1.5 leading-tight"
                          title={lang === "ar"
                            ? tpl.title_ar ||
                              tpl.name_ar ||
                              tpl.titleAr ||
                              tpl.nameAr ||
                              tpl.title ||
                              tpl.name
                            : tpl.title || tpl.name}
                        >
                          {lang === "ar"
                            ? tpl.title_ar ||
                              tpl.name_ar ||
                              tpl.titleAr ||
                              tpl.nameAr ||
                              tpl.title ||
                              tpl.name
                            : tpl.title || tpl.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                            {tpl.category}
                          </span>
                        </div>
                      </div>

                      {/* Floating labels */}
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
                        {(tpl.is_featured || tpl.isFeatured) && (
                          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-[7px] sm:text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl backdrop-blur-md">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center" data-aos="fade-up">
            <Link
              to="/templates"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 hover:scale-105 transition-all shadow-xl"
            >
              {t.templates.viewMore}
              <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ───────────────────────────────── */}
      <section className="py-24 bg-background relative overflow-hidden">
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
                {t.homeExtra.swipe} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
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
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 md:mb-10 font-medium line-clamp-2">
                      {opt.description}
                    </p>
                    <div className="space-y-4 md:space-y-5 mb-10 md:mb-14">
                      {opt.features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-primary" strokeWidth={4} />
                          </div>
                          <span className="text-sm font-bold text-foreground/80 line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        opt.id === "template"
                          ? navigate("/templates")
                          : setActivePath(opt.id)
                      }
                      className="mt-auto w-full py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] bg-primary/10 text-primary border border-primary/20 rounded-3xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-lg"
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
                {t.homeExtra.swipe} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
              </div>
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-8 md:gap-10 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pt-10 pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide max-w-6xl mx-auto">
                {(activePath === "custom" ? t.pricing.customBuildPlans : t.pricing.plans).map((plan, i) => (
                  <div
                    key={plan.id}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    className={`group relative p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] border transition-all duration-500 w-[85vw] md:w-auto flex-shrink-0 snap-center ${
                      plan.popular
                        ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 md:-translate-y-8"
                        : "bg-card text-foreground border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {t.homeExtra.mostPopular}
                      </div>
                    )}

                    <div className="mb-10 md:mb-14">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 font-oswald">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl md:text-6xl font-black">
                          {plan.price}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
                      {plan.features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-white/20" : "bg-primary/10"}`}>
                            <Check size={12} className={plan.popular ? "text-white" : "text-primary"} strokeWidth={4} />
                          </div>
                          <span className={`text-sm md:text-base font-bold ${plan.popular ? "text-primary-foreground/90" : "text-foreground/80"}`}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/order?type=${activePath}&planId=${plan.id}`
                        )
                      }
                      className={`w-full py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-3xl transition-all duration-500 shadow-xl ${
                        plan.popular
                          ? "bg-white text-primary hover:bg-accent hover:text-white"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {plan.cta || t.homeExtra.getStarted}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              className="px-14 py-6 bg-white text-primary font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-accent hover:text-white hover:scale-110 transition-all duration-500 shadow-4xl"
            >
              {t.homeExtra.getStarted}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
