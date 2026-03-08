import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Star,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";

export default function TemplateDetail() {
  const { t, lang } = useI18n();
  const { id } = useParams<{ id: string }>();
  const [activeImg, setActiveImg] = useState(0);
  const [template, setTemplate] = useState<any>(null);
  const [relatedTemplates, setRelatedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tplRes, allRes] = await Promise.all([
        api.get(`/templates/${id}`),
        api.get("/templates"),
      ]);
      const current = tplRes.data?.data || null;
      setTemplate(current);

      const all = allRes.data?.data?.templates || allRes.data?.data || [];
      const related = all
        .filter(
          (tpl: any) =>
            (tpl._id || tpl.id) !== id && tpl.category === current?.category,
        )
        .slice(0, 3);
      setRelatedTemplates(related);
      setActiveImg(0);
    } catch (err) {
      console.error("Failed to fetch template detail", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Template not found</h2>
        <Link to="/templates" className="text-indigo-600 hover:underline">
          Back to all templates
        </Link>
      </div>
    );
  }

  const name = template.title || template.name || "";
  const description = template.description || "";
  const previewImages = [
    template.image || template.previewImages?.[0],
    ...(template.previewImages?.slice(1) || []),
  ];
  if (previewImages.length === 0)
    previewImages.push("https://placehold.co/800x600?text=No+Image");

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em]">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              HME
            </Link>
            <span className="text-border">/</span>
            <Link
              to="/templates"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t.nav.templates.toUpperCase()}
            </Link>
            <span className="text-border">/</span>
            <span className="text-primary">{name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left: Images */}
          <div className="lg:col-span-2">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-10 transition-colors"
            >
              <ChevronLeft size={14} strokeWidth={3} />
              Return to Gallery
            </Link>

            {/* Main Image */}
            <div
              data-aos="fade-up"
              className="relative rounded-[2.5rem] overflow-hidden border border-border mb-6 group bg-card shadow-3xl shadow-olive-200/5"
            >
              <img
                src={previewImages[activeImg]}
                alt={name}
                className="w-full h-[450px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-10">
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.05] transition-all shadow-2xl"
                >
                  <Eye size={18} />
                  {t.templateDetail.liveDemo}
                </a>
              </div>
              {/* Badges */}
              <div className="absolute top-6 start-6 flex flex-col gap-2">
                {template.isFeatured && (
                  <span className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                    Featured Asset
                  </span>
                )}
                {template.isNew && (
                  <span className="px-4 py-2 bg-olive-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="grid grid-cols-4 gap-4"
            >
              {previewImages.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImg === i
                      ? "border-primary shadow-xl shadow-primary/10 scale-105"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>

            {/* Features */}
            <div data-aos="fade-up" className="mt-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">
                  {t.templateDetail.features}
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.features?.map((feat: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border group hover:border-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black text-foreground uppercase tracking-widest">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div data-aos="fade-up" className="mt-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">
                  {t.templateDetail.includes}
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.includes?.map((inc: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border group hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-600 flex items-center justify-center flex-shrink-0 group-hover:bg-olive-600 group-hover:text-white transition-all">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {inc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Purchase Panel */}
          <div className="lg:col-span-1">
            <div data-aos="fade-left" className="sticky top-32">
              <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-10">
                {/* Name & Rating */}
                <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter leading-none">
                  {name}
                </h1>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-xl border border-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(template.rating)
                            ? "fill-primary text-primary"
                            : "text-border fill-border"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-foreground">
                    {template.rating}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    ({template.reviews} reviews)
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-10 font-medium">
                  {description}
                </p>

                {/* Price Box */}
                <div className="mb-10 p-8 bg-muted rounded-[2rem] border border-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">
                      Investment
                    </div>
                    <div className="text-5xl font-black text-foreground tracking-tighter">
                      ${template.price}
                    </div>
                    {template.originalPrice && (
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-sm text-muted-foreground line-through font-bold">
                          Was ${template.originalPrice}
                        </span>
                        <span className="px-3 py-1 bg-olive-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                          SAVE{" "}
                          {Math.round(
                            (1 - template.price / template.originalPrice) * 100,
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Action Call */}
                <div className="flex flex-col gap-4 mb-10">
                  <Link
                    to={`/order?templateId=${template._id || template.id}&type=template_purchase`}
                    className="flex flex-col items-center justify-center w-full py-6 bg-primary text-primary-foreground rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em]">
                      <ShoppingCart size={18} strokeWidth={3} />
                      Buy Asset
                    </div>
                    <span className="text-[10px] text-primary-foreground/60 font-bold uppercase tracking-widest mt-1">
                      Finalized Product • Instant Dev Access
                    </span>
                  </Link>

                  <Link
                    to={`/order?templateId=${template._id || template.id}&type=template_modification`}
                    className="flex flex-col items-center justify-center w-full py-5 bg-muted border border-border text-foreground rounded-2xl hover:border-primary/30 hover:bg-card transition-all duration-300"
                  >
                    <div className="font-black text-xs uppercase tracking-[0.2em]">
                      Custom Setup
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                      Modified Layout • Ready in 3-5 Days
                    </span>
                  </Link>
                </div>

                {/* Specs List */}
                <div className="space-y-6 pt-10 border-t border-border">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                      Architecture
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.techStack?.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-4 py-1.5 bg-muted text-foreground text-[10px] font-black uppercase tracking-widest rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-foreground/80">
                      <Check
                        size={16}
                        className="text-primary"
                        strokeWidth={3}
                      />
                      30-Day Quality Assurance
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-foreground/80">
                      <Check
                        size={16}
                        className="text-primary"
                        strokeWidth={3}
                      />
                      Priority Technical Support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Assets */}
        {relatedTemplates.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2
                data-aos="fade-up"
                className="text-3xl font-black text-foreground tracking-tighter"
              >
                Similar <span className="text-primary">Masterpieces</span>
              </h2>
              <Link
                to="/templates"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.3em] transition-all"
              >
                View Entire Gallery
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedTemplates.map((tpl, i) => (
                <div
                  key={tpl.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="group bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-3xl hover:shadow-olive-200/20 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tpl.image}
                      alt={lang === "ar" ? tpl.nameAr : tpl.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 start-4">
                      <span className="px-3 py-1 bg-card/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-lg text-foreground">
                        ${tpl.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                        {lang === "ar" ? tpl.nameAr : tpl.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="text-xs font-black text-foreground">
                          {tpl.rating}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/templates/${tpl.id}`}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      Inspect Detail
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
