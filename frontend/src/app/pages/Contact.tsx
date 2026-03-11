import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import { useI18n } from "../../i18n";


export default function Contact() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 650, once: true, easing: "ease-out-cubic" });
  }, []);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formsubmit.co/ajax/grandtwoaar@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          _captcha: "false",
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(lang === "ar" ? "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: lang === "ar" ? "البريد الإلكتروني" : "Email",
      value: t.contact.info.email,
      color: "from-indigo-500 to-blue-500",
      link: `mailto:${t.contact.info.email}`,
    },
    {
      icon: Phone,
      label: lang === "ar" ? "الهاتف" : "Phone",
      value: t.contact.info.phone,
      color: "from-green-500 to-emerald-500",
      link: `tel:${t.contact.info.phone}`,
    },
  ];

  const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <section className="relative py-24 bg-background overflow-hidden border-b border-border">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olive-50/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
          >
            <MessageSquare size={14} strokeWidth={3} />
            <span>{t.contactExtra.badge}</span>
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter"
          >
            {t.contact.title}{" "}
            <span className="text-primary">{t.contact.titleHighlight}</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={i}
                      href={item.link}
                      data-aos="fade-right"
                      data-aos-delay={i * 80}
                      className="flex items-center gap-6 p-6 bg-card border border-border rounded-[2rem] hover:border-primary/30 hover:shadow-3xl hover:shadow-olive-200/20 transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-muted text-foreground flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-70">
                          {item.label}
                        </p>
                        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div
                data-aos="fade-right"
                data-aos-delay="400"
                className="p-8 bg-card border border-border rounded-[2.5rem]"
              >
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                  {lang === "ar" ? "التواجد الرقمي" : "Digital Presence"}
                </p>
                <div className="flex gap-4">
                  {socials.map((soc) => {
                    const Icon = soc.icon;
                    return (
                      <a
                        key={soc.label}
                        href={soc.href}
                        className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all duration-300"
                        aria-label={soc.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3" data-aos="fade-left">
              <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/10 p-10 lg:p-14">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-inner">
                      <CheckCircle2
                        size={48}
                        className="text-primary animate-bounce"
                      />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-4 tracking-tighter">
                      {t.contactExtra.successTitle}
                    </h3>
                    <p className="text-muted-foreground max-w-sm leading-relaxed font-medium mb-10">
                      {t.contactExtra.successSubtitle}
                    </p>
                    <button
                      onClick={() => {
                        setForm({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                        setSubmitted(false);
                      }}
                      className="px-10 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      {t.contactExtra.newTransmission}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="mb-10">
                      <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">
                        {t.contactExtra.initComm}
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {t.contactExtra.mandatory}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ms-1">
                          {t.contact.form.name} *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                          placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ms-1">
                          {t.contact.form.email} *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                          placeholder="corporate@domain.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ms-1">
                        {t.contact.form.subject} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                        placeholder={lang === "ar" ? "هدف الاستفسار" : "Inquiry Objective"}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ms-1">
                        {t.contact.form.message} *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none font-medium"
                        placeholder={t.contactExtra.messagePlaceholder}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/30 group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send
                            size={16}
                            strokeWidth={3}
                            className={`group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${lang === "ar" ? "rotate-180" : ""}`}
                          />
                          {t.contact.form.submit}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
