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
} from "lucide-react";
import { useI18n } from "../../i18n";

export default function Services() {
  const { t, lang } = useI18n();
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">(
    "yearly",
  );
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

  const extraFeatures = [
    { icon: Shield, label: "SSL Certificate" },
    { icon: BarChart3, label: "Analytics Setup" },
    { icon: Rocket, label: "Performance Optimization" },
    { icon: Zap, label: "Fast CDN Delivery" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
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
            <span>
              {lang === "ar"
                ? "خدمات الويب المتكاملة"
                : "Complete Scale Web Solutions"}
            </span>
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

      {/* Services Grid */}
      <section className="py-24 bg-background relative border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activePath ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {t.services.options.map((opt, j) => (
                <div
                  key={opt.id}
                  data-aos="fade-up"
                  data-aos-delay={j * 100}
                  className="group relative p-12 rounded-[2.5rem] bg-card border border-border hover:border-primary/30 hover:shadow-3xl hover:shadow-olive-200/20 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-20 h-20 rounded-[1.5rem] bg-primary text-primary-foreground flex items-center justify-center mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                    {opt.id === "template" && <Zap size={36} />}
                    {opt.id === "setup" && <Smartphone size={36} />}
                    {opt.id === "custom" && <Star size={36} />}
                  </div>

                  <h3 className="text-3xl font-black text-foreground mb-4">
                    {opt.name}
                  </h3>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                    {opt.description}
                  </p>

                  <div className="space-y-4 mb-12">
                    {opt.features.map((feat, k) => (
                      <div
                        key={k}
                        className="flex items-center gap-3 text-xs font-bold text-foreground/80 uppercase tracking-widest"
                      >
                        <Check
                          size={16}
                          className="text-primary flex-shrink-0"
                          strokeWidth={3}
                        />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      opt.id === "template"
                        ? navigate("/templates")
                        : setActivePath(opt.id || opt.name)
                    }
                    className="w-full flex items-center justify-center gap-3 py-5 bg-muted text-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                  >
                    {opt.cta}
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div data-aos="fade-in">
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-4 bg-muted p-1 rounded-2xl border border-border mb-6">
                  <button
                    onClick={() => setActivePath(null)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black text-primary uppercase tracking-widest hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <ArrowRight
                      size={14}
                      className={isRTL ? "" : "rotate-180"}
                    />
                    {lang === "ar" ? "رجوع" : "Back"}
                  </button>
                  <div className="h-4 w-[1px] bg-border" />
                  <span className="px-4 py-2 text-sm font-black text-foreground uppercase tracking-tight">
                    {optName(activePath)} {lang === "ar" ? "خطط" : "Collection"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {t.pricing.plans.map((plan, l) => (
                  <div
                    key={plan.id}
                    data-aos="fade-up"
                    data-aos-delay={l * 100}
                    className={`relative p-10 rounded-[2.5rem] border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl ${
                      plan.popular
                        ? "border-primary bg-card"
                        : "border-border bg-card/50 hover:border-primary/20"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                        {lang === "ar" ? "الأكثر تميزاً" : "Premium Choice"}
                      </div>
                    )}
                    <h3 className="text-2xl font-black text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase mb-8 tracking-[0.2em]">
                      {t.pricing.planNotice}
                    </p>
                    <p className="text-sm text-muted-foreground mb-10 leading-relaxed font-medium">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-12">
                      <span className="text-5xl font-black text-foreground tracking-tighter">
                        {plan.yearlyPrice}
                      </span>
                      <span className="text-xs text-muted-foreground font-black uppercase tracking-widest ms-1">
                        {lang === "ar" ? "/سنوياً" : "/year"}
                      </span>
                    </div>

                    <div className="space-y-5 mb-12">
                      {plan.features.map((feat, m) => (
                        <div
                          key={m}
                          className="flex items-center gap-4 text-xs font-bold text-foreground opacity-90"
                        >
                          <Check
                            size={18}
                            className="text-primary flex-shrink-0"
                            strokeWidth={3}
                          />
                          {feat}
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/order?service=${activePath}&plan=${plan.id}`}
                      className={`w-full flex items-center justify-center py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                        plan.popular
                          ? "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.03]"
                          : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground shadow-black/5"
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
              Mastering the <span className="text-primary">Workflow</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              A precise, high-end methodology focused on results, launching your
              vision in as little as 7 days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
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

      {/* Extra Features Included */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-12 lg:p-20 bg-muted/30 border border-border rounded-[3.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-olive-500/5 rounded-full blur-[80px]" />

            <div className="flex-1 max-w-xl text-center lg:text-start lg:rtl:text-end relative z-10">
              <h2
                data-aos="fade-up"
                className="text-3xl sm:text-5xl font-black text-foreground mb-6"
              >
                Standard with{" "}
                <span className="text-primary">Every Project</span>
              </h2>
              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest"
              >
                We don't compromise on quality. Every build includes
                industry-leading standards by default.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {extraFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm"
                  >
                    <feat.icon size={20} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block w-[400px] relative">
              <div className="aspect-square bg-primary/10 rounded-full flex items-center justify-center p-12 animate-spin-slow">
                <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center">
                  <Shield size={120} className="text-primary/20" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket size={60} className="text-primary animate-bounce" />
              </div>
            </div>
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
            Scale Your Business{" "}
            <span className="text-olive-200">Beyond Boundaries</span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-xl text-primary-foreground/70 mb-14 max-w-2xl mx-auto leading-relaxed"
          >
            Expert consultation and premium execution. Discover the perfect
            strategy for your next digital leap.
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/contact"
              className="px-12 py-5 bg-card text-foreground font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-background hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Talk to an Expert
            </Link>
            <Link
              to="/templates"
              className="px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              Browse Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
