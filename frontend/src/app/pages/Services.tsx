import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router";

import {
  Check,
  ArrowRight,
  Zap,
  Headphones,
  Code2,
  Rocket,
  Shield,
  BarChart3,
  Smartphone,
  Star,
  Globe,
  Search,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { div } from "three/src/nodes/math/OperatorNode.js";

export default function Services() {
  const { t, lang } = useI18n();
  const [activePath, setActivePath] = useState<string | null>(null);
  const [isRTL, setIsRTL] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsRTL(lang === "ar");
  }, [lang]);

  const optName = (id: string | null) => {
    if (!id) return "";
    const opt = t.services.options.find((o) => o.id === id);
    return opt ? opt.name : id;
  };

  useEffect(() => {
    AOS.init({ duration: 650, once: true, easing: "ease-out-cubic" });
  }, []);

  const processSteps = [
    {
      icon: Zap,
      title: "Discovery",
      titleAr: "الاكتشاف",
      desc: "We learn about your business, goals, and target audience.",
    },
    {
      icon: Code2,
      title: "Design & Build",
      titleAr: "التصميم والبناء",
      desc: "Our team designs and develops your website to perfection.",
    },
    {
      icon: Rocket,
      title: "Launch",
      titleAr: "الإطلاق",
      desc: "We deploy your website and make it live for the world.",
    },
    {
      icon: Headphones,
      title: "Support",
      titleAr: "الدعم",
      desc: "Ongoing maintenance, updates, and 24/7 support.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background pt-20"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="relative py-24 bg-background overflow-hidden border-b border-border">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olive-100/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-olive-50/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>{t.servicesExtra.badge}</span>
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter"
          >
            {t.services.title}{" "}
            <span className="text-primary">
              {t.services.titleHighlight || "Crafted"}
            </span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.services.subtitle}
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-border/50"
          >
            {t.pricing.planNotice}
          </div>
        </div>
      </div>

      <section className="py-24 bg-background relative border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activePath ? (
            <div data-aos="fade-up">
              <div className="md:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 animate-pulse select-none w-full">
                {lang === "ar" ? "اسحب للتصفح" : "Swipe to explore"} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
              </div>
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-8 md:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-12 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {t.services.options.map((opt, j) => (
                  <div
                    key={opt.id}
                    data-aos="fade-up"
                    data-aos-delay={j * 100}
                    className="group relative p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] bg-card border border-border/50 hover:border-primary/50 hover:shadow-4xl hover:-translate-y-4 transition-all duration-500 w-[85vw] md:w-auto flex-shrink-0 snap-center"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-primary text-primary-foreground flex items-center justify-center mb-8 md:mb-10 shadow-glow group-hover:scale-110 transition-transform duration-500">
                      {opt.id === "template" && <Zap size={40} />}
                      {opt.id === "setup" && <Smartphone size={40} />}
                      {opt.id === "custom" && <Star size={40} />}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4 md:mb-6 tracking-tight">
                      {opt.name}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 md:mb-10 font-medium">
                      {opt.description}
                    </p>

                    <div className="space-y-4 md:space-y-5 mb-10 md:mb-14">
                      {opt.features.map((feat, k) => (
                        <div key={k} className="flex items-center gap-4">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check
                              size={12}
                              className="text-primary"
                              strokeWidth={4}
                            />
                          </div>
                          <span className="text-xs md:text-sm font-bold text-foreground/80">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        opt.id === "template"
                          ? navigate("/templates")
                          : setActivePath(opt.id || opt.name)
                      }
                      className="w-full flex items-center justify-center py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] bg-primary/10 text-primary border border-primary/20 rounded-3xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-lg"
                    >
                      {opt.cta}
                      <ArrowRight
                        size={16}
                        className={`ms-2 ${lang === "ar" ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div data-aos="fade-in">
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-4 bg-muted p-2 rounded-3xl border border-border">
                  <button
                    onClick={() => setActivePath(null)}
                    className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white rounded-2xl transition-all shadow-sm"
                  >
                    <ArrowRight
                      size={16}
                      className={lang === "ar" ? "" : "rotate-180"}
                    />
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
                {t.pricing.plans.map((plan, l) => (
                  <div
                    key={plan.id}
                    data-aos="fade-up"
                    data-aos-delay={l * 100}
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
                      <span className="text-muted-foreground font-black text-xs uppercase tracking-widest ms-1">
                        {t.homeExtra.perYear}
                      </span>
                    </div>

                    <div className="space-y-5 mb-16">
                      {plan.features.map((feat, m) => (
                        <div
                          key={m}
                          className="flex items-center gap-4 text-sm font-bold text-foreground"
                        >
                          <Check
                            size={20}
                            className="text-primary flex-shrink-0"
                            strokeWidth={4}
                          />
                          {feat}
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/order?service=${activePath}&plan=${plan.id}`}
                      className={`w-full flex items-center justify-center py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 shadow-xl ${
                        plan.popular
                          ? "bg-primary text-white shadow-primary/40 hover:scale-[1.05]"
                          : "bg-foreground text-background hover:bg-primary hover:text-white shadow-black/5"
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

      {/* Process Section */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2
              data-aos="fade-up"
              className="text-4xl sm:text-5xl font-black text-foreground mb-6"
            >
              {t.servicesExtra.workflowTitle}
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {t.servicesExtra.workflowSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative font-medium">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative mb-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-3xl group-hover:shadow-primary/20 transition-all duration-500">
                      <Icon size={32} />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-card border-2 border-primary text-primary text-xs font-black flex items-center justify-center shadow-lg">
                      0{i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tighter">
                    {lang === "ar" ? step.titleAr : step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            {t.servicesExtra.scaleBusiness}
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-xl text-primary-foreground/70 mb-14 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {t.servicesExtra.strategySubtitle}
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/contact"
              className="px-12 py-5 bg-white text-primary font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-olive-50 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {t.servicesExtra.talkExpert}
            </Link>
            <Link
              to="/templates"
              className="px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              {t.servicesExtra.browseLibrary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
