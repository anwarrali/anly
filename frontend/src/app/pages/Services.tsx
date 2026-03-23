import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Check,
  ArrowRight,
  Zap,
  Code2,
  Rocket,
  Star,
  Smartphone,
  Layout,
  Cpu,
  MousePointer2,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { EyeLogo } from "../../app/components/ui/EyeLogo";

export default function Services() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const [activeService, setActiveService] = useState<"customization" | "custom_build" | null>(
    (searchParams.get("flow") as any) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 650, once: true, easing: "ease-out-cubic" });
  }, []);

  const customizationPlans = t.pricing.plans;
  const customBuildPlans = t.pricing.customBuildPlans;

  return (
    <div className="min-h-screen bg-background pt-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <section className="relative py-32 bg-background-secondary overflow-hidden border-b border-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div data-aos="fade-up" className="inline-flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.services.page.badge}</span>
          </div>
          <h1 data-aos="fade-up" data-aos-delay="100" className="text-5xl sm:text-7xl font-black text-foreground mb-8 tracking-tighter uppercase font-oswald">
            {t.services.page.title} <span className="text-primary italic">{t.services.page.titleHighlight}</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="150" className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {t.services.page.subtitle}
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activeService ? (
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Option 1: Customization */}
              <div 
                onClick={() => setActiveService("customization")}
                className="group p-12 border border-border hover:border-accent rounded-[3.5rem] transition-all duration-500 bg-background-secondary cursor-pointer hover:-translate-y-2 shadow-sm"
                data-aos="fade-right"
              >
                <div className="w-20 h-20 bg-accent/10 text-accent flex items-center justify-center mb-10 rounded-[2rem] group-hover:bg-accent group-hover:text-black transition-all">
                  <Layout size={32} />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase font-oswald tracking-tight">{t.services.page.templateChoice.title}</h3>
                <p className="text-muted-foreground mb-8 font-medium">{t.services.page.templateChoice.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  {t.services.page.templateChoice.cta} <ArrowRight size={14} className={`group-hover:translate-x-2 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Option 2: Full Custom */}
              <div 
                onClick={() => setActiveService("custom_build")}
                className="group p-12 border border-border hover:border-accent rounded-[3.5rem] transition-all duration-500 bg-background-secondary cursor-pointer hover:-translate-y-2 shadow-sm"
                data-aos="fade-left"
              >
                <div className="w-20 h-20 bg-accent/10 text-accent flex items-center justify-center mb-10 rounded-[2rem] group-hover:bg-accent group-hover:text-black transition-all">
                  <Cpu size={32} />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase font-oswald tracking-tight">{t.services.page.customChoice.title}</h3>
                <p className="text-muted-foreground mb-8 font-medium">{t.services.page.customChoice.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  {t.services.page.customChoice.cta} <ArrowRight size={14} className={`group-hover:translate-x-2 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
          ) : (
            <div data-aos="fade-in">
              <button 
                onClick={() => setActiveService(null)}
                className="flex items-center gap-3 mb-16 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowRight size={16} className={lang === 'ar' ? '' : 'rotate-180'} /> {t.services.page.back}
              </button>

              <div className="text-center mb-20">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">{t.services.page.tieredTitle}</span>
                <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase font-oswald tracking-tight">
                  {activeService === "customization" ? t.services.page.customizationPlans : t.services.page.customBuildPackages}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {(activeService === "customization" ? customizationPlans : customBuildPlans).map((plan, i) => (
                  <div 
                    key={plan.id} 
                    className={`relative p-10 border transition-all duration-500 hover:-translate-y-4 rounded-[3.5rem] ${
                      plan.popular ? "bg-card border-accent shadow-glow-accent" : "bg-background-secondary border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent text-black text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-lg">
                        {t.services.page.mostPopular}
                      </div>
                    )}
                    <h4 className="text-2xl font-black text-foreground mb-2 font-oswald uppercase">{plan.name}</h4>
                    <div className="text-4xl font-black text-accent mb-6 font-oswald">{plan.price}</div>
                    <p className="text-sm text-muted-foreground mb-10 font-medium leading-relaxed">{plan.description}</p>
                    
                    <div className="space-y-4 mb-12">
                      {plan.features.map((f, k) => (
                        <div key={k} className="flex items-center gap-3 text-xs font-bold text-foreground">
                          <Check size={16} className="text-primary" strokeWidth={3} />
                          {f}
                        </div>
                      ))}
                    </div>

                    <Link 
                      to={`/order?service=${activeService}&plan=${plan.id}&templateId=${searchParams.get("templateId") || ""}`}
                      className={`w-full flex items-center justify-center py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${
                        plan.popular ? "bg-accent text-black shadow-lg" : "bg-foreground text-background"
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
      <section className="py-32 bg-background-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div data-aos="fade-right">
                <h2 className="text-5xl font-black text-foreground mb-8 tracking-tighter uppercase font-oswald">{t.services.page.process.title} <span className="text-primary italic">{t.services.page.process.titleHighlight}</span></h2>
                <p className="text-muted-foreground text-lg mb-12 font-medium">{t.services.page.process.subtitle}</p>
                
                <div className="space-y-12">
                  {t.services.page.process.steps.map((step, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 shrink-0 bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {i === 0 ? <MousePointer2 size={24} /> : i === 1 ? <Code2 size={24} /> : <Rocket size={24} />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-foreground mb-2 font-oswald uppercase">{step.title}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="relative aspect-square" data-aos="zoom-in">
                <div className="absolute inset-0 bg-primary/10 blur-[100px]" />
                <div className="absolute inset-10 border border-primary/20 rotate-45" />
                <div className="absolute inset-20 border border-primary/40 -rotate-12" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                   <div className="w-[300px] h-[300px]">
                     <EyeLogo />
                   </div>
                </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
