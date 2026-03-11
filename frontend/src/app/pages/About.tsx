import { useEffect } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Linkedin,
  Target,
  Heart,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { teamMembers } from "../../utils/data";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1758873271902-a63ecd5b5235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const TEAM_IMG =
  "https://images.unsplash.com/photo-1670851050245-d861fd433d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const values = [
  {
    icon: Target,
    title: "Mission Driven",
    titleAr: "قائمة على المهمة",
    desc: "Every decision we make is guided by our commitment to helping our clients succeed online.",
    descAr: "كل قرار نتخذه مدفوع بالتزامنا بمساعدة عملائنا على النجاح.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Heart,
    title: "Client Focused",
    titleAr: "يتمحور حول العميل",
    desc: "We put our clients first in everything we do from design decisions to support responses.",
    descAr:
      "نضع عملاءنا في المقام الأول في كل ما نفعله من قرارات التصميم إلى ردود الدعم.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    titleAr: "الابتكار أولاً",
    desc: "We constantly push boundaries to bring you the latest in web design and development trends.",
    descAr:
      "نحن نتجاوز الحدود باستمرار لنقدم لك أحدث اتجاهات تصميم وتطوير الويب.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Users,
    title: "Community",
    titleAr: "المجتمع",
    desc: "We build lasting relationships with our clients and contribute to the business community.",
    descAr: "نحن نبني علاقات دائمة مع عملائنا ونساهم في مجتمع الأعمال.",
    color: "from-purple-500 to-indigo-600",
  },
];

export default function About() {
  const { t, lang } = useI18n();

  useEffect(() => {
    AOS.init({ duration: 650, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative py-32 bg-background overflow-hidden border-b border-border">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olive-100/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-olive-50/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-start lg:rtl:text-end">
              <div
                data-aos="fade-up"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{t.about.badge}</span>
              </div>
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-4xl sm:text-6xl font-black text-foreground leading-[1.1] mb-8 tracking-tighter"
              >
                {t.about.title}
                <br />
                <span className="text-primary">{t.about.titleHighlight}</span>
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
              >
                {t.about.subtitle}
              </p>

              {/* Stats */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {t.about.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[1.5rem] bg-card border border-border text-center group hover:border-primary transition-all duration-300"
                  >
                    <div className="text-3xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              data-aos="zoom-out-left"
              data-aos-delay="200"
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl scale-110" />
              <div className="relative rounded-[3rem] overflow-hidden border border-border shadow-3xl">
                <img
                  src={ABOUT_IMG}
                  alt="About ANLY"
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              {/* Floating Element */}
              <div className="absolute -bottom-10 -left-10 p-8 bg-card border border-border rounded-[2rem] shadow-3xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-foreground tracking-tight line-clamp-1">
                      {t.aboutExtra.excellenceDriven}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t.aboutExtra.since}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-aos="fade-up"
            className="bg-muted/30 rounded-[3rem] p-12 sm:p-20 text-center border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 relative z-10">
              <Target size={36} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-8 tracking-tight relative z-10">
              {t.about.mission.title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium relative z-10">
              {t.about.mission.text}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              data-aos="fade-up"
              className="text-4xl sm:text-5xl font-black text-foreground mb-6"
            >
              {t.aboutExtra.dna} <span className="text-primary">ANLY</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-muted-foreground text-lg max-w-xl mx-auto font-medium"
            >
              {t.aboutExtra.principlesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="group p-10 bg-card rounded-[2.5rem] border border-border hover:border-primary/20 hover:shadow-3xl hover:shadow-olive-200/20 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted text-foreground flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tighter">
                    {lang === "ar" ? val.titleAr : val.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === "ar" ? val.descAr : val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2
            data-aos="fade-up"
            className="text-4xl sm:text-6xl font-black text-primary-foreground mb-8 tracking-tighter"
          >
            {lang === "ar" ? "" : "Ready to "}
            <span className="text-olive-200">{t.aboutExtra.forgeLegacy}</span>
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-xl text-primary-foreground/70 mb-14 max-w-2xl mx-auto leading-relaxed"
          >
            {t.aboutExtra.joinBusinesses}
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/order"
              className="px-12 py-5 bg-card text-foreground font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-background hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {t.aboutExtra.startProject}
            </Link>
            <Link
              to="/contact"
              className="px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              {t.aboutExtra.connectWithUs}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
