import { useState, useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  Linkedin,
  Github,
  Globe,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "../../i18n";

export default function Contact() {
  const { t, lang } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(formRef.current!);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/grandtwoaar@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `SeeV New Inquiry: ${data.subject}`,
          _captcha: "false",
        }),
      });

      if (response.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(t.contactExtra.alertFailed);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.info.emailLabel,
      value: t.contact.info.email,
      href: `mailto:${t.contact.info.email}`,
      color: "blue",
    },
    {
      icon: Phone,
      label: t.contact.info.phoneLabel,
      value: t.contact.info.phone,
      href: `tel:${t.contact.info.phone}`,
      color: "green",
    },
  ];

  const socials = [
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", color: "#0077B5" },
    { name: "GitHub", icon: Github, href: "https://github.com", color: "#333" },
    { name: "Portfolio", icon: Globe, href: "https://seev.io", color: "#0052d6" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      <section className="py-24 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            {/* Contact Info Side */}
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t.contactExtra.badge}
              </div>
              <h1 className="text-4xl sm:text-7xl font-black text-foreground mb-6 sm:mb-8 tracking-tighter leading-none">
                {t.contact.title}{" "}
                <span className="text-primary italic">{t.contact.titleHighlight}</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-lg mb-12 leading-relaxed">
                {t.contact.subtitle}
              </p>

              <div className="space-y-6 mb-16">
                {contactInfo.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="group flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-3xl bg-card border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 w-full overflow-hidden"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shrink-0">
                      <item.icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 sm:mb-1.5 group-hover:text-primary transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-base sm:text-xl font-bold text-foreground truncate">
                        {item.value}
                      </div>
                    </div>
                    <ArrowUpRight className={`ml-auto ${lang === 'ar' ? 'mr-auto' : ''} shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all w-4 h-4 sm:w-5 sm:h-5`} />
                  </a>
                ))}
              </div>

              <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8">
                  {t.contactExtra.digitalPresence}
                </h3>
                <div className="flex gap-4">
                  {socials.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 group"
                      title={social.name}
                    >
                      <social.icon size={22} className="group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div data-aos="fade-left" data-aos-delay="200" className="relative group/form w-full">
              <div className="absolute inset-x-0 -inset-y-4 bg-primary/5 rounded-3xl sm:rounded-[3rem] blur-2xl sm:blur-3xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000" />
              <div className="bg-card border border-border p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden w-full">
                {status === "success" ? (
                  <div className="py-20 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-10 border border-green-500/20">
                      <CheckCircle2 size={44} className="text-green-600" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">
                      {t.contactExtra.successTitle}
                    </h2>
                    <p className="text-muted-foreground font-medium mb-12 max-w-xs mx-auto text-sm leading-relaxed">
                      {t.contactExtra.successSubtitle}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-foreground transition-all shadow-xl"
                    >
                      <MessageCircle size={14} /> {t.contactExtra.newTransmission}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h2 className="text-3xl font-black text-foreground mb-3 tracking-tighter uppercase leading-none">
                        {t.contactExtra.initComm}
                      </h2>
                      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">
                        {t.contactExtra.mandatory}
                      </p>
                    </div>

                    {status === "error" && (
                      <div className={`flex items-center gap-4 p-5 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-sm font-bold animate-in bounce-in duration-300 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <AlertCircle size={20} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className={`text-[10px] font-black text-primary uppercase tracking-[0.2em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>
                             {t.contact.form.name} *
                          </label>
                          <input
                            required
                            name="name"
                            type="text"
                            placeholder={t.contactExtra.placeholder.name}
                            className="w-full bg-background border border-border p-5 text-sm rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className={`text-[10px] font-black text-primary uppercase tracking-[0.2em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>
                            {t.contact.form.email} *
                          </label>
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            className="w-full bg-background border border-border p-5 text-sm rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className={`text-[10px] font-black text-primary uppercase tracking-[0.2em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>
                          {t.contact.form.subject} *
                        </label>
                        <input
                          required
                          name="subject"
                          type="text"
                          placeholder={t.contactExtra.placeholder.subject}
                          className="w-full bg-background border border-border p-5 text-sm rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className={`text-[10px] font-black text-primary uppercase tracking-[0.2em] ${lang === 'ar' ? 'mr-1' : 'ml-1'}`}>
                          {t.contact.form.message} *
                        </label>
                        <textarea
                          required
                          name="message"
                          rows={4}
                          placeholder={t.contactExtra.messagePlaceholder}
                          className="w-full bg-background border border-border p-5 text-sm rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium resize-none shadow-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full flex items-center justify-center gap-4 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:shadow-glow-primary hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all duration-300 shadow-xl overflow-hidden group relative"
                      >
                        {status === "sending" ? (
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            <span>TRANSITIONING...</span>
                          </div>
                        ) : (
                          <>
                            <span>{t.contact.form.submit}</span>
                            <Send size={18} className={`group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
