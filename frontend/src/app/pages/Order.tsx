import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  User,
  Briefcase,
  CheckCircle2,
  Star,
  Layout,
  Cpu,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "../../i18n";
import supabase from "../../utils/supabase";

type Step = 1 | 2 | 3;

interface FormData {
  serviceType: string;
  planId: string;
  templateId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  budget: string;
  timeline: string;
  description: string;
  requirements: string;
}

const initialForm: FormData = {
  serviceType: "",
  planId: "",
  templateId: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  budget: "",
  timeline: "",
  description: "",
  requirements: "",
};

export default function Order() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    fetchTemplates();

    const service = searchParams.get("service") || searchParams.get("type"); // new or legacy
    const plan = searchParams.get("plan");
    const templateId = searchParams.get("templateId");

    if (service) {
      setForm(prev => ({ 
        ...prev, 
        serviceType: service, 
        planId: plan || "", 
        templateId: templateId || "" 
      }));
      setStep(2); // Skip step 1 if coming from services/templates
    }
  }, [searchParams]);

  const fetchTemplates = async () => {
    try {
      const { data: list, error } = await supabase.from('templates').select('*');
      if (error) throw error;
      setDbTemplates(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getServiceLabel = () => {
    if (form.serviceType === "direct_purchase" || form.serviceType === "template_purchase") return t.order.labels.directPurchase;
    if (form.serviceType === "customization") return t.order.labels.templateCustomization;
    if (form.serviceType === "custom_build") return t.order.labels.customBuild;
    return form.serviceType || t.order.labels.webService;
  };

  const getPrice = () => {
    if (form.serviceType === "direct_purchase" || form.serviceType === "template_purchase") {
       const tpl = dbTemplates.find(t => (t.id || t._id) === form.templateId);
       return tpl ? tpl.price : 0;
    }
    if (form.serviceType === "customization") {
      if (form.planId === "free") return 0;
      if (form.planId === "basic") return 199;
      if (form.planId === "premium") return 499;
    }
    return 0; // Custom build is quote-based
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isPaid = (form.serviceType === "direct_purchase" || form.serviceType === "template_purchase") && getPrice() > 0;

      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;

      const payload = {
        templateId: form.templateId || null,
        serviceType: `${form.serviceType}_${form.planId}`.replace(/_$/, ''),
        amount: getPrice(),
        status: 'pending',
        user_id: userId || null,
        siteData: {
          businessName: form.company,
          websiteGoal: form.description,
          additionalNotes: `Plan: ${form.planId}\nRequirements: ${form.requirements}\nPhone: ${form.phone}\nWebsite: ${form.website}\nTimeline: ${form.timeline}\nBudget: ${form.budget}`,
        },
      };

      const { data: order, error } = await supabase.from("orders").insert([payload]).select().single();
      if (error) throw error;

      // Email notification via FormSubmit (Background)
      fetch("https://formsubmit.co/ajax/grandtwoaar@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `SeeV Order/Inquiry: ${getServiceLabel()} - ${form.company || form.name}`,
          service: getServiceLabel(),
          plan: form.planId,
          template: form.templateId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          budget: form.budget,
          timeline: form.timeline,
          description: form.description,
          requirements: form.requirements,
          price: `$${getPrice()}`,
          _captcha: "false",
        }),
      }).catch(err => console.error("Email notify failed", err));

      setSubmitted(true);
    } catch (err: any) {
      console.error("Order failed", err);
      alert(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div data-aos="zoom-in" className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <CheckCircle2 size={40} className="text-primary" strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter uppercase font-oswald text-primary">
             {t.order.success.title}
          </h2>
          <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed">
            {t.order.success.message}
          </p>
          <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-all shadow-glow-accent">
            {t.order.success.cta} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Progress Header */}
        <div className="flex flex-col items-center mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${step >= 1 ? 'bg-primary text-white border-primary shadow-glow' : 'bg-background border-border text-muted-foreground'}`}>{t.order.steps.one}</div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-border'} rounded-full`} />
            <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${step >= 2 ? 'bg-primary text-white border-primary shadow-glow' : 'bg-background border-border text-muted-foreground'}`}>{t.order.steps.two}</div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary' : 'bg-border'} rounded-full`} />
            <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${step >= 3 ? 'bg-primary text-white border-primary shadow-glow' : 'bg-background border-border text-muted-foreground'}`}>{t.order.steps.three}</div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter uppercase font-oswald text-center">
            {t.order.title} <span className="text-primary italic">{t.order.titleHighlight}</span>
          </h1>
        </div>
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div data-aos="fade-up" className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'template_purchase', label: t.order.labels.directPurchase, icon: ShoppingCart, color: 'blue', desc: 'Get a professional template instantly.' },
              { id: 'customization', label: t.order.labels.templateCustomization, icon: Settings, color: 'orange', desc: 'We customize a template for your brand.' },
              { id: 'custom_build', label: t.order.labels.customBuild, icon: Cpu, color: 'primary', desc: 'Full custom solution from scratch.' }
            ].map(service => (
              <button
                key={service.id}
                onClick={() => { setForm({ ...form, serviceType: service.id }); setStep(2); }}
                className="p-10 rounded-[3rem] bg-card border border-border hover:border-primary/50 hover:shadow-2xl transition-all text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mx-auto mb-8 transition-colors`}>
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">{service.label}</h3>
                <p className="text-xs text-muted-foreground font-medium">{service.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Information Intake */}
        {step === 2 && (
          <form data-aos="fade-up" onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="max-w-4xl mx-auto">
            <div className="bg-background-secondary border border-border p-10 md:p-16 rounded-[3.5rem] shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">{t.order.form.personalArchive}</h3>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.name}</label>
                    <input required type="text" value={form.name} onChange={e=>update('name', e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium" placeholder={t.order.form.placeholders.name} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.email}</label>
                    <input required type="email" value={form.email} onChange={e=>update('email', e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium" placeholder={t.order.form.placeholders.email} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.phone}</label>
                    <input type="tel" value={form.phone} onChange={e=>update('phone', e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium" placeholder={t.order.form.placeholders.phone} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">{t.order.form.projectParams}</h3>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.company}</label>
                    <input type="text" value={form.company} onChange={e=>update('company', e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium" placeholder={t.order.form.placeholders.company} />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.timeline}</label>
                    <select value={form.timeline} onChange={e=>update('timeline', e.target.value)} className={`w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium appearance-none ${lang === 'ar' ? 'pl-5 pr-5' : 'pl-5 pr-5'}`}>
                       <option className="bg-background text-foreground" value="">{t.order.form.placeholders.timeline}</option>
                       <option className="bg-background text-foreground" value="asap">ASAP / بأسرع وقت</option>
                       <option className="bg-background text-foreground" value="1-month">1 Month / شهر واحد</option>
                       <option className="bg-background text-foreground" value="flexible">Flexible / مرن</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.labels.budget}</label>
                    <select value={form.budget} onChange={e=>update('budget', e.target.value)} className={`w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-accent outline-none transition-all font-medium appearance-none ${lang === 'ar' ? 'pl-5 pr-5' : 'pl-5 pr-5'}`}>
                       <option className="bg-background text-foreground" value="">{t.order.form.placeholders.budget}</option>
                       <option className="bg-background text-foreground" value="<500">{lang === 'ar' ? 'تحت ٥٠٠ دولار' : 'Under $500'}</option>
                       <option className="bg-background text-foreground" value="500-1500">$500 - $1,500</option>
                       <option className="bg-background text-foreground" value="1500+">$1,500+</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black text-primary uppercase tracking-[0.3em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>{t.order.form.projectNarrative}</label>
                    <textarea required rows={4} value={form.description} onChange={e=>update('description', e.target.value)} className="w-full bg-background border border-border p-5 text-sm focus:border-primary outline-none transition-all font-medium resize-none shadow-sm rounded-3xl" placeholder={t.order.form.placeholders.description} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-12 gap-10">
               <button type="button" onClick={() => navigate(-1)} className="px-12 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
               <button type="submit" className="px-12 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl">{t.order.process.continue}</button>
            </div>
          </form>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div data-aos="fade-up" className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-8">
                 <div className="bg-background-secondary border border-border p-10 rounded-[2.5rem] shadow-sm">
                   <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">{t.order.verification.title}</h3>
                   <div className="grid grid-cols-2 gap-8 text-sm font-medium">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t.order.form.labels.architecture}</p>
                        <p className="text-foreground">{getServiceLabel()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t.order.form.labels.tier}</p>
                        <p className="text-foreground uppercase">{form.planId || 'Standard'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t.order.form.labels.identity}</p>
                        <p className="text-foreground">{form.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t.order.form.labels.contact}</p>
                        <p className="text-foreground">{form.email}</p>
                      </div>
                   </div>
                 </div>

                 <div className="bg-background-secondary border border-border p-10 rounded-[2.5rem] shadow-sm">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight font-oswald mb-4">{t.order.verification.securityTitle}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                       <ShieldCheck className="text-primary shrink-0" size={24} />
                       {t.order.verification.securityText}
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                <div className="bg-primary text-white p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-glow-primary">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">{t.order.labels.estimatedCapital}</span>
                  <div className="text-6xl font-black font-oswald mb-2">${getPrice()}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {getPrice() === 0 ? t.order.labels.quoteRequired : t.order.labels.initFee}
                  </p>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-foreground text-background py-6 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-2xl"
                >
                  {loading ? t.homeExtra.processing : t.order.process.execute}
                </button>
                
                <button 
                   onClick={() => setStep(2)}
                   className="w-full border border-border py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-primary transition-all"
                >
                  {t.order.process.edit}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
