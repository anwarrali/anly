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
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";

type Step = 1 | 1.2 | 1.5 | 2 | 3;

interface FormData {
  serviceType: string;
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

    const urlType = searchParams.get("type"); // legacy/template detail
    const urlTpl = searchParams.get("templateId");
    const urlService = searchParams.get("service"); // new path
    const urlPlan = searchParams.get("plan");

    if (urlService && urlPlan) {
      const finalType =
        urlService === "setup" ? `${urlPlan}_setup` : `custom_${urlPlan}`;
      update("serviceType", finalType);
      if (urlTpl) update("templateId", urlTpl);
      setStep(urlService === "custom" ? 2 : (1.5 as any)); // 1.5 means template pick
    } else if (urlType) {
      update("serviceType", urlType);
      if (urlTpl) update("templateId", urlTpl);
      setStep(2);
    }
  }, [searchParams]);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates");
      const list = res.data?.data?.templates || res.data?.data || [];
      setDbTemplates(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const mainPaths = [
    {
      id: "template",
      label: t.services.options[0].name,
      desc: t.services.options[0].description,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "setup",
      label: t.services.options[1].name,
      desc: t.services.options[1].description,
      icon: Briefcase,
      color: "from-indigo-600 to-purple-600",
    },
    {
      id: "custom",
      label: t.services.options[2].name,
      desc: t.services.options[2].description,
      icon: Star,
      color: "from-purple-600 to-pink-500",
    },
  ];

  const planOptions = [
    {
      id: "basic",
      label: t.pricing.plans[0].name,
      price: lang === "ar" ? "يعتمد على المتطلبات" : "Custom Quote",
      edits: "5",
    },
    {
      id: "standard",
      label: t.pricing.plans[1].name,
      price: lang === "ar" ? "يعتمد على المتطلبات" : "Custom Quote",
      edits: "10",
      popular: true,
    },
    {
      id: "premium",
      label: t.pricing.plans[2].name,
      price: lang === "ar" ? "يعتمد على المتطلبات" : "Custom Quote",
      edits: "Unlimited",
    },
  ];

  const [selectedMainPath, setSelectedMainPath] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        templateId: form.templateId || null,
        serviceType: form.serviceType,
        amount: selectedTemplate?.price || 0,
        siteData: {
          businessName: form.company,
          websiteGoal: form.description,
          additionalNotes: `Requirements: ${form.requirements}\nPhone: ${form.phone}\nWebsite: ${form.website}\nTimeline: ${form.timeline}\nBudget: ${form.budget}`,
        },
      };

      const res = await api.post("/orders", payload);
      const order = res.data.data;

      const isPaid = form.serviceType === "template_purchase";

      if (!isPaid) {
        // Use free FormSubmit to notify admin instantly without mail server configs
        // Removed await to prevent '100 year loading' if the third-party service is slow
        fetch("https://formsubmit.co/ajax/grandtwoaar@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New Request: ${form.serviceType} from ${form.company || form.name}`,
            serviceType: form.serviceType,
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            website: form.website,
            budget: form.budget,
            timeline: form.timeline,
            description: form.description,
            requirements: form.requirements,
            _captcha: "false",
          }),
        }).catch(err => console.error("FormSubmit background notify failed:", err));
      }

      if (isPaid) {
        // Redirect to Bank of Palestine (Mastercard) checkout using Paymob
        try {
          const payRes = await api.post(
            `/payments/checkout/${order._id || order.id}`,
          );
          if (payRes.data.data.url) {
            window.location.href = payRes.data.data.url;
            return;
          }
        } catch (payErr: any) {
          const msg = payErr.response?.data?.message || "Checkout failed.";
          alert(
            `Payment error: ${msg}\n\nPlease contact support if this continues.`,
          );
          return;
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Order submission failed", err);
      alert(
        err.response?.data?.message ||
          "Failed to submit order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedService = (() => {
    if (form.serviceType === "template_purchase") {
      return {
        label: lang === "ar" ? "قالب جاهز" : "Ready-made Template",
        icon: ShoppingCart,
        color: "from-blue-500 to-cyan-500",
        price: lang === "ar" ? "شراء لمرة واحدة" : "One-time purchase",
      };
    }
    const parts = form.serviceType.split("_");
    const plan = planOptions.find((p) => p.id === parts[0]);
    if (!plan) return null;
    const isSetup = parts[1] === "setup";
    return {
      label: `${plan.label} (${isSetup ? (lang === "ar" ? "إعداد" : "Setup") : lang === "ar" ? "مخصص" : "Custom"})`,
      icon: isSetup ? Briefcase : Star,
      color: isSetup
        ? "from-indigo-600 to-purple-600"
        : "from-purple-600 to-pink-500",
      price: plan.price,
    };
  })();
  const selectedTemplate = dbTemplates.find(
    (tpl) => (tpl._id || tpl.id) === form.templateId,
  );

  const stepLabels = [
    t.order.steps.service,
    t.order.steps.details,
    t.order.steps.confirm,
  ];

  const getStepNumber = (s: Step) => {
    if (s <= 1.5) return 1;
    return s === 2 ? 2 : 3;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div data-aos="zoom-in" className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <CheckCircle2 size={40} className="text-primary" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter">
            {t.order.success.title}
          </h2>
          <p className="text-muted-foreground mb-10 text-sm font-medium">
            {t.order.success.message}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              to="/"
              className="px-8 py-4 border border-border text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-primary/30 transition-all"
            >
              {t.nav.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-background border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-olive-100/10 rounded-full blur-[100px] translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <ShoppingCart size={14} strokeWidth={3} />
            <span>Transaction Portal</span>
          </div>
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-6xl font-black text-foreground mb-4 tracking-tighter"
          >
            {t.order.title}{" "}
            <span className="text-primary">{t.order.titleHighlight}</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-muted-foreground text-lg max-w-xl mx-auto font-medium"
          >
            {t.order.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        {/* Stepper */}
        <div
          data-aos="fade-up"
          className="flex items-center justify-center mb-20"
        >
          {stepLabels.map((label, i) => {
            const num = i + 1;
            const stepNum = getStepNumber(step);
            const isActive = stepNum === num;
            const isDone = stepNum > num;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border-2 ${
                      isDone
                        ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20"
                        : isActive
                          ? "bg-background border-primary text-primary shadow-xl shadow-primary/10"
                          : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check size={20} strokeWidth={3} /> : num}
                  </div>
                  <span
                    className={`mt-3 text-[10px] font-black uppercase tracking-widest hidden sm:block ${
                      isActive
                        ? "text-primary"
                        : isDone
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 sm:w-24 h-[2px] mx-4 mb-8 transition-all duration-500 rounded-full ${
                      stepNum > num ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Main Path Selection */}
        {step === 1 && (
          <div data-aos="fade-up" className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">
                Deployment <span className="text-primary">Architecture</span>
              </h2>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
                Select your preferred implementation strategy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {mainPaths.map((path) => {
                const Icon = path.icon;
                const isSelected = selectedMainPath === path.id;
                return (
                  <button
                    key={path.id}
                    onClick={() => {
                      setSelectedMainPath(path.id);
                      if (path.id === "template") {
                        update("serviceType", "template_purchase");
                        setStep(1.5);
                      } else {
                        setStep(1.2);
                      }
                    }}
                    className={`group relative p-10 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-3xl shadow-primary/10 scale-[1.02]"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-xl"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-muted text-primary flex items-center justify-center mb-8 border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-tighter">
                      {path.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium">
                      {path.desc}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      {lang === "ar" ? "اختر هدا المسار" : "Execute Strategy"}
                      <ArrowRight
                        size={14}
                        strokeWidth={3}
                        className={lang === "ar" ? "rotate-180" : ""}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1.2: Plan Selection */}
        {step === 1.2 && (
          <div data-aos="fade-up" className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-16">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full transition-all mb-8 border border-primary/20"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                {lang === "ar" ? "رجوع" : "Previous Tier"}
              </button>
              <h2 className="text-3xl font-black text-foreground tracking-tighter">
                {lang === "ar" ? "اختر خطة الاشتراك" : "Select Subscription"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {planOptions.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    const finalType =
                      selectedMainPath === "setup"
                        ? `${plan.id}_setup`
                        : `custom_${plan.id}`;
                    update("serviceType", finalType);
                    setStep(selectedMainPath === "custom" ? 2 : 1.5);
                  }}
                  className={`group relative p-10 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 ${
                    plan.popular
                      ? "border-primary bg-card shadow-3xl shadow-primary/10"
                      : "border-border bg-card hover:border-primary/20"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      {lang === "ar" ? "الأكثر شعبية" : "Elite Tier"}
                    </span>
                  )}
                  <h3 className="text-2xl font-black text-foreground mb-1 tracking-tighter">
                    {plan.label}
                  </h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">
                    {t.pricing.planNotice}
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-black text-foreground tracking-tighter">
                      {plan.price}
                    </span>
                  </div>
                  <ul className="space-y-4 mb-10 pb-10 border-b border-border">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                      <Check
                        size={18}
                        className="text-primary"
                        strokeWidth={3}
                      />
                      {plan.edits} Annual Edits
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                      <Check
                        size={18}
                        className="text-primary"
                        strokeWidth={3}
                      />
                      Secure Hosting
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                      <Check
                        size={18}
                        className="text-primary"
                        strokeWidth={3}
                      />
                      Priority Access
                    </li>
                  </ul>
                  <div className="w-full py-4 text-center bg-muted text-foreground font-black uppercase tracking-widest text-xs rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-border group-hover:border-primary">
                    {lang === "ar" ? "اختر الخطة" : "Activate Tier"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1.5: Template Selection */}
        {step === 1.5 && (
          <div data-aos="fade-up">
            <div className="flex flex-col items-center mb-16">
              <button
                onClick={() => setStep(selectedMainPath === "setup" ? 1.2 : 1)}
                className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full transition-all mb-8 border border-primary/20"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                {lang === "ar" ? "رجوع" : "Back Track"}
              </button>
              <h2 className="text-3xl font-black text-foreground tracking-tighter">
                {t.order.form.template}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
              {dbTemplates.map((tpl: any) => {
                const isSelected = form.templateId === (tpl._id || tpl.id);
                return (
                  <button
                    key={tpl._id || tpl.id}
                    onClick={() => update("templateId", tpl._id || tpl.id)}
                    className={`relative group rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-2xl scale-[1.05]"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={tpl.image || tpl.previewImages?.[0]}
                        alt={lang === "ar" ? tpl.nameAr : tpl.title || tpl.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 text-left">
                      <p className="text-xs font-black text-foreground uppercase tracking-tight truncate mb-1">
                        {lang === "ar" ? tpl.nameAr : tpl.title || tpl.name}
                      </p>
                      <p className="text-[10px] font-bold text-primary">
                        ${tpl.price}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl border border-white/20">
                        <Check size={16} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(2)}
                disabled={!form.templateId}
                className="flex items-center gap-3 px-16 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {t.order.form.next}
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {step === 2 && (
          <form
            data-aos="fade-up"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">
                Project <span className="text-primary">Intelligence</span>
              </h2>
              <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                Define the parameters for your digital asset
              </p>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8 sm:p-14">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-muted text-primary flex items-center justify-center border border-border">
                  <User size={22} />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">
                  Ownership Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    {t.order.form.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                    placeholder="Full Integrity Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    {t.order.form.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                    placeholder="official@domain.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    {t.order.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                    placeholder="+971 00 000 0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    {t.order.form.company}
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                    placeholder="Organization Entity"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    {t.order.form.website}
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                    placeholder="https://existing-ref.com"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-muted text-primary flex items-center justify-center border border-border">
                    <Briefcase size={22} />
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase">
                    Project Scope
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      {t.order.form.budget}
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer font-medium"
                    >
                      <option value="">Allocated Capital...</option>
                      <option value="under-500">Tier I (&lt;$500)</option>
                      <option value="500-1000">Tier II ($500 - $1,000)</option>
                      <option value="1000-5000">
                        Tier III ($1,000 - $5,000)
                      </option>
                      <option value="5000+">Enterprise ($5,000+)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      {t.order.form.timeline}
                    </label>
                    <select
                      value={form.timeline}
                      onChange={(e) => update("timeline", e.target.value)}
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer font-medium"
                    >
                      <option value="">Strategic Deadline...</option>
                      <option value="asap">Immediate Focus</option>
                      <option value="1-2-weeks">1–2 Weeks Phase</option>
                      <option value="1-month">Standard Month</option>
                      <option value="flexible">Fluid Timeline</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      {t.order.form.description} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none font-medium"
                      placeholder="Narrative description of project objectives, target demographics, and core functionality..."
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      {t.order.form.requirements}
                    </label>
                    <textarea
                      rows={3}
                      value={form.requirements}
                      onChange={(e) => update("requirements", e.target.value)}
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none font-medium"
                      placeholder="Explicit technical integrations, specific features, or architectural constraints..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-12">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-3 px-8 py-4 border-2 border-border text-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:border-primary/30 transition-all"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                {t.order.form.back}
              </button>
              <button
                type="submit"
                className="flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all"
              >
                {form.serviceType !== "template_purchase"
                  ? lang === "ar"
                    ? "متابعة الطلب"
                    : "Continue to Request"
                  : t.order.form.next}
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div data-aos="fade-up" className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">
                Order <span className="text-primary">Verification</span>
              </h2>
              <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                Final review of selected parameters
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
              <div className="lg:col-span-3 bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

                <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-tighter">
                  Configuration Summary
                </h3>

                <div className="space-y-6 mb-10">
                  {selectedService && (
                    <div className="flex items-center gap-6 p-6 bg-muted rounded-[2rem] border border-border">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg">
                        <selectedService.icon size={26} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Service Layer
                        </p>
                        <p className="text-lg font-black text-foreground tracking-tight">
                          {selectedService.label}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTemplate && selectedMainPath !== "custom" && (
                    <div className="flex items-center gap-6 p-6 bg-muted rounded-[2rem] border border-border">
                      <img
                        src={
                          selectedTemplate.image ||
                          selectedTemplate.previewImages?.[0]
                        }
                        alt={selectedTemplate.title || selectedTemplate.name}
                        className="w-20 h-14 rounded-xl object-cover flex-shrink-0 shadow-md ring-1 ring-border"
                      />
                      <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Base Asset
                        </p>
                        <p className="text-lg font-black text-foreground tracking-tight">
                          {selectedTemplate.title || selectedTemplate.name}
                        </p>
                      </div>
                      <div className="ms-auto font-black text-primary text-lg">
                        ${selectedTemplate.price}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-foreground rounded-[2.5rem] flex flex-col items-center justify-center text-background shadow-2xl relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">
                        Total Finalization
                      </p>
                      <p className="text-lg font-black tracking-tight text-left">
                        {lang === "ar" ? "المجموع الكلي" : "Gross Investment"}
                      </p>
                    </div>
                    <div className="text-3xl font-black tracking-tighter text-primary">
                      {form.serviceType !== "template_purchase"
                        ? lang === "ar"
                          ? "سيتم مناقشة السعر"
                          : "Will be discussed"
                        : `$${selectedTemplate?.price || 0}`}
                    </div>
                  </div>
                  {form.serviceType !== "template_purchase" && (
                    <div className="mt-6 w-full text-left bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary text-[10px] sm:text-xs font-bold tracking-wide leading-relaxed">
                      {lang === "ar"
                        ? "ملاحظة: آلية الدفع هي ٥٠٪ عربون مقدم قبل بدء العمل، والـ ٥٠٪ المتبقية تدفع بعد انتهاء المشروع والموافقة عليه."
                        : "Note: Payment terms are 50% upfront deposit before work begins, and the remaining 50% is paid after the project is completed and approved."}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card rounded-[2.5rem] border border-border p-8">
                  <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 border-b border-border pb-4">
                    Client Intel
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: "Name", value: form.name },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone || "N/A" },
                      { label: "Company", value: form.company || "N/A" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-foreground truncate">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-[2.5rem] border border-border p-8">
                  <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 border-b border-border pb-4">
                    Scope Specs
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: "Budget", value: form.budget || "N/A" },
                      { label: "Timeline", value: form.timeline || "N/A" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-foreground truncate">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-3 px-8 py-5 border-2 border-border text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-primary/30 transition-all w-full sm:w-auto justify-center"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                Modify Params
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed transition-all w-full shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Negotiating Transfer...
                  </>
                ) : (
                  <>
                    {form.serviceType !== "template_purchase"
                      ? lang === "ar"
                        ? "إرسال الطلب"
                        : "Send Request"
                      : lang === "ar"
                      ? "إتمام الشراء"
                      : "Confirm & Initialize"}
                    <ArrowRight
                      size={18}
                      strokeWidth={3}
                      className={lang === "ar" ? "rotate-180" : ""}
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
