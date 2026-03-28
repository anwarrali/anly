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
  CreditCard,
  Lock,
  Shield,
  FileText,
  Download,
  Send,
  Package,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useI18n } from "../../i18n";
import supabase from "../../utils/supabase";
import { sendEmailRequest } from "../../utils/emailService";
import { getValidImageUrl } from "../../utils/imageHandler";

/* ───────── Types ───────── */
type ServiceType = "direct_purchase" | "customization" | "custom_build" | "";

interface FormData {
  serviceType: ServiceType;
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
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
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
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardName: "",
};

/* ───────── Step Definitions Per Flow ───────── */
const FLOW_STEPS = {
  direct_purchase: [
    { key: "contact", label: "Contact Info" },
    { key: "payment", label: "Payment" },
    { key: "success", label: "Complete" },
  ],
  customization: [
    { key: "plan", label: "Select Plan" },
    { key: "details", label: "Project Details" },
    { key: "review", label: "Send Request" },
  ],
  custom_build: [
    { key: "plan", label: "Select Plan" },
    { key: "details", label: "Project Details" },
    { key: "review", label: "Send Request" },
  ],
};

/* ────────────────────────── Component ────────────────────────── */
export default function Order() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    fetchTemplates();

    const serviceParam = (searchParams.get("service") || searchParams.get("type") || "") as ServiceType;
    const plan = searchParams.get("plan") || "";
    const templateId = searchParams.get("templateId") || "";

    if (serviceParam) {
      setForm(prev => ({
        ...prev,
        serviceType: serviceParam,
        planId: plan,
        templateId: templateId,
      }));
      setStep(1);
    }
  }, [searchParams]);

  const fetchTemplates = async () => {
    try {
      const { data: list, error } = await supabase.from("templates").select("*");
      if (error) throw error;
      setDbTemplates(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const selectedTemplate = dbTemplates.find(t => (t.id || t._id) === form.templateId);

  /* ── Price Logic ── */
  const getTemplatePrice = () => selectedTemplate?.price || 0;

  const getPlanPrice = () => {
    if (form.serviceType === "customization") {
      if (form.planId === "free") return 0;
      if (form.planId === "basic") return 199;
      if (form.planId === "premium") return 499;
    }
    return 0;
  };

  const getTotalPrice = () => {
    if (form.serviceType === "direct_purchase") return getTemplatePrice();
    if (form.serviceType === "customization") return getTemplatePrice() + getPlanPrice();
    return 0; // custom_build → quote-based
  };

  const getServiceLabel = () => {
    if (form.serviceType === "direct_purchase") return t.order.labels.directPurchase;
    if (form.serviceType === "customization") return t.order.labels.templateCustomization;
    if (form.serviceType === "custom_build") return t.order.labels.customBuild;
    return t.order.labels.webService;
  };

  const isQuoteBased = form.serviceType === "custom_build";

  /* ── Active steps for current flow ── */
  const flowSteps = form.serviceType ? FLOW_STEPS[form.serviceType as keyof typeof FLOW_STEPS] : [];

  /* ── Submit Handler ── */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isPurchase = form.serviceType === "direct_purchase";

      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;

      // Removed Supabase DB insertions as requested. FormSubmit handles all notifications.

      // Email notification using Global Email Request System
      await sendEmailRequest({
        subject: isPurchase
            ? `SeeV PURCHASE: ${form.name} — $${getTotalPrice()}`
            : `SeeV REQUEST: ${getServiceLabel()} — ${form.company || form.name}`,
        serviceType: getServiceLabel(),
        template: selectedTemplate?.title || "N/A",
        plan: form.planId || "N/A",
        price: form.serviceType === "custom_build" ? "Will be determined after discussion" : `$${getTotalPrice()}`,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        timeline: form.timeline,
        budget: form.budget,
        description: form.description,
        requirements: form.requirements,
      });

      if (isPurchase && selectedTemplate) {
        setDownloadUrl(selectedTemplate.template_file_url || selectedTemplate.download_url || "");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Order failed", err);
      alert(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════ RENDERS ═══════════════════════ */

  /* ── Step 0: No service selected (select service) ── */
  if (!form.serviceType) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-20">
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter uppercase font-oswald text-center">
              {t.order.title} <span className="text-primary italic">{t.order.titleHighlight}</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-4 text-center max-w-xl">{t.order.subtitle}</p>
          </div>
          <div data-aos="fade-up" className="grid md:grid-cols-3 gap-8">
            {[
              { id: "direct_purchase" as ServiceType, label: t.order.labels.directPurchase, icon: ShoppingCart, desc: lang === "ar" ? "اشترِ موقعًا جاهزًا وحمّله فورًا." : "Buy a ready-made website and download instantly." },
              { id: "customization" as ServiceType, label: t.order.labels.templateCustomization, icon: Settings, desc: lang === "ar" ? "نخصص قالبًا ليناسب علامتك التجارية." : "We customize a template to match your brand." },
              { id: "custom_build" as ServiceType, label: t.order.labels.customBuild, icon: Cpu, desc: lang === "ar" ? "حل مخصص بالكامل من الصفر." : "Full custom solution built from scratch." },
            ].map(service => (
              <button
                key={service.id}
                onClick={() => {
                  setForm({ ...form, serviceType: service.id });
                  if (service.id === "direct_purchase") navigate("/templates");
                  else setStep(1);
                }}
                className="p-10 rounded-[3rem] bg-card border border-border hover:border-primary/50 hover:shadow-2xl transition-all text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mx-auto mb-8 transition-colors">
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">{service.label}</h3>
                <p className="text-xs text-muted-foreground font-medium">{service.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Success Screen ── */
  if (submitted) {
    const isPurchase = form.serviceType === "direct_purchase";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div data-aos="zoom-in" className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <CheckCircle2 size={40} className="text-primary" strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-primary mb-4 tracking-tighter uppercase font-oswald">
            {isPurchase ? (lang === "ar" ? "تمت عملية الشراء!" : "Purchase Complete!") : t.order.success.title}
          </h2>
          <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed">
            {isPurchase
              ? (lang === "ar"
                ? "تم تأكيد الدفع. يمكنك تحميل ملفات الموقع الآن."
                : "Your payment has been confirmed. You can download your website files below.")
              : (lang === "ar"
                ? "تم إرسال طلبك بنجاح. سيتم التواصل معك لإكمال تفاصيل الدفع والإعداد."
                : "Your request has been submitted. Payment will be completed after setup confirmation. We will contact you shortly.")}
          </p>

          {isPurchase && downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-foreground transition-all shadow-glow-primary mb-6"
            >
              <Download size={16} /> {lang === "ar" ? "تحميل الملفات" : "Download Files"}
            </a>
          )}

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-10 py-5 bg-muted text-foreground text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-all"
            >
              {t.order.success.cta} <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Wizard Layout ── */
  return (
    <div className="min-h-screen bg-background pt-32 pb-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Progress Header */}
        <div className="flex flex-col items-center mb-20">
          <div className="flex items-center gap-4 mb-8">
            {flowSteps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all text-sm font-black ${
                    step > i + 1
                      ? "bg-primary text-white border-primary"
                      : step === i + 1
                      ? "bg-primary text-white border-primary shadow-glow"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? <Check size={18} strokeWidth={3} /> : i + 1}
                </div>
                {i < flowSteps.length - 1 && (
                  <div className={`w-12 h-1 ${step > i + 1 ? "bg-primary" : "bg-border"} rounded-full`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter uppercase font-oswald">
              {t.order.title} <span className="text-primary italic">{t.order.titleHighlight}</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-4">
              {getServiceLabel()} {selectedTemplate ? `— ${selectedTemplate.title}` : ""}
            </p>
          </div>
        </div>

        {/* ════════════ DIRECT PURCHASE FLOW ════════════ */}
        {form.serviceType === "direct_purchase" && (
          <>
            {/* Step 1: Contact Info */}
            {step === 1 && (
              <form data-aos="fade-up" onSubmit={e => { e.preventDefault(); setStep(2); }} className="max-w-3xl mx-auto">
                <div className="bg-card border border-border p-10 md:p-14 rounded-[3rem] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">
                    {lang === "ar" ? "معلومات الاتصال" : "Contact Information"}
                  </h3>
                  {selectedTemplate && (
                    <div className="flex items-center gap-6 p-5 bg-muted/50 rounded-2xl mb-8 border border-border">
                      <img src={selectedTemplate.image_url || selectedTemplate.image} alt="" className="w-20 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="font-black text-sm uppercase tracking-tight">{selectedTemplate.title}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{selectedTemplate.category}</div>
                      </div>
                      <div className="text-2xl font-black text-primary font-oswald">${selectedTemplate.price}</div>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.name} *</label>
                      <input required type="text" value={form.name} onChange={e => update("name", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.email} *</label>
                      <input required type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.email} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.phone}</label>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.phone} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-10 gap-6">
                  <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
                  <button type="submit" className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl">{t.order.form.next}</button>
                </div>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div data-aos="fade-up" className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                    <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                        <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald">{t.order.form.paymentInfo}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                          <Lock size={12} /> {t.order.form.visaBadge}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{lang === "ar" ? "رقم البطاقة" : "Card Number"}</label>
                          <div className="relative">
                            <CreditCard className={`absolute ${lang === "ar" ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 text-muted-foreground`} size={18} />
                            <input required type="text" value={form.cardNumber} onChange={e => update("cardNumber", e.target.value)} className={`w-full bg-background border border-border p-5 ${lang === "ar" ? "pr-14" : "pl-14"} text-sm rounded-2xl focus:border-primary outline-none transition-all font-mono tracking-widest`} placeholder="0000 0000 0000 0000" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t.order.form.placeholders.expiry}</label>
                            <input required type="text" value={form.expiry} onChange={e => update("expiry", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all text-center font-mono" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">CVV</label>
                            <input required type="password" value={form.cvv} onChange={e => update("cvv", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all text-center font-mono" placeholder="***" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t.order.form.placeholders.cardName}</label>
                          <input required type="text" value={form.cardName} onChange={e => update("cardName", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-bold uppercase" placeholder="NAME ON CARD" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4">
                      <ShieldCheck className="text-primary shrink-0" size={22} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.order.verification.securityText}</p>
                    </div>
                  </div>

                  {/* Price Sidebar */}
                  <div className="space-y-6">
                    {selectedTemplate && (
                      <div className="bg-card border border-border rounded-[2.5rem] p-6 overflow-hidden">
                        <img src={selectedTemplate.image_url || selectedTemplate.image} alt="" className="w-full h-32 object-cover rounded-2xl mb-4" />
                        <h4 className="font-black text-lg tracking-tight mb-1">{selectedTemplate.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{selectedTemplate.category}</p>
                      </div>
                    )}
                    <div className="bg-primary text-white p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-glow-primary overflow-hidden relative group">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70 relative z-10">{lang === "ar" ? "المبلغ الإجمالي" : "Total"}</span>
                      <div className="text-6xl font-black font-oswald mb-2 relative z-10">${getTotalPrice()}</div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-foreground text-background py-6 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3"
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <><CreditCard size={18} /> {t.order.form.purchase}</>}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full border border-border py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-primary transition-all">{t.order.process.back}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════════ CUSTOMIZATION FLOW ════════════ */}
        {form.serviceType === "customization" && (
          <>
            {/* Step 1: Select Template (if not pre-selected) + Select Plan */}
            {step === 1 && (
              <div data-aos="fade-up" className="max-w-6xl mx-auto">
                {/* Template selector — only if no template pre-selected */}
                {!form.templateId && (
                  <div className="mb-16">
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 text-center">
                      {lang === "ar" ? "1. اختر القالب" : "1. Select Template"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {dbTemplates.map(tpl => (
                        <button
                          key={tpl.id || tpl._id}
                          onClick={() => update("templateId", tpl.id || tpl._id)}
                          className="group rounded-2xl border border-border overflow-hidden hover:border-primary transition-all text-left"
                        >
                          <img src={getValidImageUrl(tpl.image_url || tpl.image, tpl.category)} alt="" className="w-full aspect-[4/3] object-cover" />
                          <div className="p-3">
                            <div className="text-xs font-black truncate">{lang === "ar" ? (tpl.title_ar || tpl.title) : tpl.title}</div>
                            <div className="text-primary font-black text-sm">${tpl.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected template preview */}
                {form.templateId && selectedTemplate && (
                  <div className="flex items-center gap-6 p-5 bg-card border border-primary/30 rounded-2xl mb-10 max-w-3xl mx-auto">
                    <img src={selectedTemplate.image_url || selectedTemplate.image} alt="" className="w-20 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-black text-sm uppercase tracking-tight">{selectedTemplate.title}</div>
                      <div className="text-primary font-black text-lg">${selectedTemplate.price}</div>
                    </div>
                    <button onClick={() => update("templateId", "")} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-red-500 transition-colors">
                      {lang === "ar" ? "تغيير" : "Change"}
                    </button>
                  </div>
                )}

                {/* Plan selection */}
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 text-center">
                  {lang === "ar" ? "اختر خطة الإعداد" : "Select Setup Plan"}
                </h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {t.pricing.plans.map((plan, i) => (
                    <div
                      key={plan.id}
                      className={`relative p-10 border transition-all duration-500 hover:-translate-y-4 rounded-[3rem] cursor-pointer ${
                        form.planId === plan.id
                          ? "bg-card border-primary shadow-glow-primary"
                          : plan.popular
                          ? "bg-card border-accent shadow-glow-accent"
                          : "bg-card border-border"
                      }`}
                      onClick={() => update("planId", plan.id)}
                    >
                      {plan.popular && !form.planId && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent text-black text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-lg">
                          {t.services.page.mostPopular}
                        </div>
                      )}
                      {form.planId === plan.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-lg">
                          <Check size={12} className="inline mr-1" /> {lang === "ar" ? "مختار" : "Selected"}
                        </div>
                      )}
                      <h4 className="text-2xl font-black text-foreground mb-2 font-oswald uppercase">{plan.name}</h4>
                      <div className="text-4xl font-black text-primary mb-6 font-oswald">{plan.price}</div>
                      <p className="text-sm text-muted-foreground mb-10 font-medium leading-relaxed">{plan.description}</p>
                      <div className="space-y-4 mb-8">
                        {plan.features.map((f, k) => (
                          <div key={k} className="flex items-center gap-3 text-xs font-bold text-foreground">
                            <Check size={16} className="text-primary" strokeWidth={3} /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Total */}
                {form.templateId && form.planId && (
                  <div data-aos="fade-up" className="mt-10 max-w-md mx-auto p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{lang === "ar" ? "التكلفة الإجمالية" : "Total Cost"}</div>
                    <div className="text-3xl font-black font-oswald text-foreground">
                      ${getTemplatePrice()} + ${getPlanPrice()} = <span className="text-primary">${getTotalPrice()}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-widest">
                      {lang === "ar" ? "قالب + خطة إعداد" : "Template + Setup Plan"}
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-12 gap-6 max-w-3xl mx-auto">
                  <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
                  <button
                    disabled={!form.templateId || !form.planId}
                    onClick={() => setStep(2)}
                    className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.order.form.next} <ChevronRight size={14} className={`inline ${lang === "ar" ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
              <form data-aos="fade-up" onSubmit={e => { e.preventDefault(); setStep(3); }} className="max-w-4xl mx-auto">
                <div className="bg-card border border-border p-10 md:p-14 rounded-[3rem] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">
                    {lang === "ar" ? "تفاصيل المشروع" : "Project Details"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.name} *</label>
                      <input required type="text" value={form.name} onChange={e => update("name", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.email} *</label>
                      <input required type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.email} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.phone}</label>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.phone} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.company}</label>
                      <input type="text" value={form.company} onChange={e => update("company", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.company} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.timeline}</label>
                      <select value={form.timeline} onChange={e => update("timeline", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium appearance-none">
                        <option value="">{t.order.form.placeholders.timeline}</option>
                        <option value="asap">ASAP</option>
                        <option value="1-month">{lang === "ar" ? "شهر واحد" : "1 Month"}</option>
                        <option value="flexible">{lang === "ar" ? "مرن" : "Flexible"}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.budget}</label>
                      <select value={form.budget} onChange={e => update("budget", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium appearance-none">
                        <option value="">{t.order.form.placeholders.budget}</option>
                        <option value="<500">{lang === "ar" ? "تحت ٥٠٠ دولار" : "Under $500"}</option>
                        <option value="500-1500">$500 - $1,500</option>
                        <option value="1500+">$1,500+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.description} *</label>
                      <textarea required rows={4} value={form.description} onChange={e => update("description", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-3xl focus:border-primary outline-none transition-all font-medium resize-none" placeholder={t.order.form.placeholders.description} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-10 gap-6">
                  <button type="button" onClick={() => setStep(1)} className="px-10 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
                  <button type="submit" className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl">{t.order.process.continue}</button>
                </div>
              </form>
            )}

            {/* Step 3: Review + Send Request */}
            {step === 3 && (
              <div data-aos="fade-up" className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                    <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
                      <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">{t.order.verification.title}</h3>
                      <div className="grid grid-cols-1 gap-4 text-sm font-medium">
                        {[
                          { label: lang === "ar" ? "الخدمة" : "Service", value: getServiceLabel() },
                          { label: lang === "ar" ? "القالب" : "Template", value: selectedTemplate?.title || "N/A" },
                          { label: lang === "ar" ? "الخطة" : "Plan", value: form.planId.toUpperCase() },
                          { label: t.order.form.name, value: form.name },
                          { label: t.order.form.email, value: form.email },
                          { label: t.order.form.phone, value: form.phone || "—" },
                          { label: t.order.form.company, value: form.company || "—" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{row.label}</span>
                            <span className="font-bold text-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4">
                      <Shield className="text-primary shrink-0" size={20} />
                      <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wide">
                        {lang === "ar"
                          ? "سيتم إكمال الدفع بعد تأكيد الإعداد. سيتواصل معك فريقنا لتحديد التفاصيل."
                          : "Payment will be completed after setup confirmation. Our team will contact you to finalize details."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-primary text-white p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-glow-primary overflow-hidden relative group">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70 relative z-10">
                        {isQuoteBased ? (lang === "ar" ? "الفاتورة التقديرية" : "Final Price") : t.order.labels.estimatedCapital}
                      </span>
                      <div className={`font-black font-oswald mb-2 relative z-10 ${isQuoteBased ? 'text-3xl' : 'text-5xl'}`}>
                        {isQuoteBased ? (lang === "ar" ? "يُحدد لاحقاً" : "TBD") : `$${getTotalPrice()}`}
                      </div>
                      {!isQuoteBased && (
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10 mt-1">
                          ${getTemplatePrice()} + ${getPlanPrice()}
                        </p>
                      )}
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className="w-full bg-foreground text-background py-6 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3">
                      {loading ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> {t.order.form.submitRequest}</>}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full border border-border py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-primary transition-all">{t.order.process.edit}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════════ CUSTOM BUILD FLOW ════════════ */}
        {form.serviceType === "custom_build" && (
          <>
            {/* Step 1: Select Plan */}
            {step === 1 && (
              <div data-aos="fade-up" className="max-w-6xl mx-auto">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 text-center">
                  {lang === "ar" ? "اختر الحزمة" : "Select Package"}
                </h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {t.pricing.plans.map((plan, i) => (
                    <div
                      key={plan.id}
                      className={`relative p-10 border transition-all duration-500 hover:-translate-y-4 rounded-[3rem] cursor-pointer ${
                        form.planId === plan.id
                          ? "bg-card border-primary shadow-glow-primary"
                          : plan.popular
                          ? "bg-card border-accent shadow-glow-accent"
                          : "bg-card border-border"
                      }`}
                      onClick={() => update("planId", plan.id)}
                    >
                      {plan.popular && form.planId !== plan.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent text-black text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-lg">
                          {t.services.page.mostPopular}
                        </div>
                      )}
                      {form.planId === plan.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-lg">
                          <Check size={12} className="inline mr-1" /> {lang === "ar" ? "مختار" : "Selected"}
                        </div>
                      )}
                      <h4 className="text-2xl font-black text-foreground mb-2 font-oswald uppercase">{plan.name}</h4>
                      <div className="text-4xl font-black text-primary mb-6 font-oswald">{plan.price}</div>
                      <p className="text-sm text-muted-foreground mb-10 font-medium leading-relaxed">{plan.description}</p>
                      <div className="space-y-4">
                        {plan.features.map((f, k) => (
                          <div key={k} className="flex items-center gap-3 text-xs font-bold text-foreground">
                            <Check size={16} className="text-primary" strokeWidth={3} /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* No fixed price notice */}
                <div data-aos="fade-up" className="mt-10 max-w-md mx-auto p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center">
                  <MessageSquare size={24} className="text-amber-500 mx-auto mb-3" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {lang === "ar" ? "السعر النهائي يُحدد بعد المناقشة." : "Final price will be determined after discussion."}
                  </p>
                </div>

                <div className="flex justify-between mt-12 gap-6 max-w-3xl mx-auto">
                  <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
                  <button
                    disabled={!form.planId}
                    onClick={() => setStep(2)}
                    className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.order.form.next} <ChevronRight size={14} className={`inline ${lang === "ar" ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details Form — same as customization */}
            {step === 2 && (
              <form data-aos="fade-up" onSubmit={e => { e.preventDefault(); setStep(3); }} className="max-w-4xl mx-auto">
                <div className="bg-card border border-border p-10 md:p-14 rounded-[3rem] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">
                    {lang === "ar" ? "تفاصيل المشروع" : "Project Details"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.name} *</label>
                      <input required type="text" value={form.name} onChange={e => update("name", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.email} *</label>
                      <input required type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.email} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.phone}</label>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.phone} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.company}</label>
                      <input type="text" value={form.company} onChange={e => update("company", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium" placeholder={t.order.form.placeholders.company} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.timeline}</label>
                      <select value={form.timeline} onChange={e => update("timeline", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium appearance-none">
                        <option value="">{t.order.form.placeholders.timeline}</option>
                        <option value="asap">ASAP</option>
                        <option value="1-month">{lang === "ar" ? "شهر واحد" : "1 Month"}</option>
                        <option value="flexible">{lang === "ar" ? "مرن" : "Flexible"}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.budget}</label>
                      <select value={form.budget} onChange={e => update("budget", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-2xl focus:border-primary outline-none transition-all font-medium appearance-none">
                        <option value="">{t.order.form.placeholders.budget}</option>
                        <option value="<500">{lang === "ar" ? "تحت ٥٠٠ دولار" : "Under $500"}</option>
                        <option value="500-1500">$500 - $1,500</option>
                        <option value="1500+">$1,500+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">{t.order.form.description} *</label>
                      <textarea required rows={4} value={form.description} onChange={e => update("description", e.target.value)} className="w-full bg-background border border-border p-5 text-sm rounded-3xl focus:border-primary outline-none transition-all font-medium resize-none" placeholder={t.order.form.placeholders.description} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-10 gap-6">
                  <button type="button" onClick={() => setStep(1)} className="px-10 py-5 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all rounded-xl">{t.order.process.back}</button>
                  <button type="submit" className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all rounded-xl shadow-xl">{t.order.process.continue}</button>
                </div>
              </form>
            )}

            {/* Step 3: Review + Send Request */}
            {step === 3 && (
              <div data-aos="fade-up" className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                    <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
                      <h3 className="text-2xl font-black text-foreground uppercase tracking-tight font-oswald mb-8 border-b border-border pb-4">{t.order.verification.title}</h3>
                      <div className="grid grid-cols-1 gap-4 text-sm font-medium">
                        {[
                          { label: lang === "ar" ? "الخدمة" : "Service", value: getServiceLabel() },
                          { label: lang === "ar" ? "الحزمة" : "Package", value: form.planId.toUpperCase() },
                          { label: t.order.form.name, value: form.name },
                          { label: t.order.form.email, value: form.email },
                          { label: t.order.form.phone, value: form.phone || "—" },
                          { label: t.order.form.company, value: form.company || "—" },
                          { label: t.order.form.timeline, value: form.timeline || "—" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{row.label}</span>
                            <span className="font-bold text-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
                      <MessageSquare className="text-amber-500 shrink-0" size={20} />
                      <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wide">
                        {lang === "ar"
                          ? "السعر النهائي يُحدد بعد المناقشة. سيتواصل معك فريقنا لتحديد التفاصيل والتكلفة."
                          : "Final price will be determined after discussion. Our team will contact you to finalize details and pricing."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-foreground text-background p-10 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden relative group">
                      <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <MessageSquare size={32} className="text-primary mb-3 relative z-10" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 relative z-10">
                        {lang === "ar" ? "يُحدد لاحقاً" : "To Be Discussed"}
                      </span>
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-foreground hover:text-background transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> {t.order.form.submitRequest}</>}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full border border-border py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-primary transition-all">{t.order.process.edit}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
