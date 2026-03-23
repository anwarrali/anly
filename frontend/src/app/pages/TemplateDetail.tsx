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
import { TemplatePreview } from "../components/ui/TemplatePreview";
import { AnimatePresence } from "motion/react";

export default function TemplateDetail() {
  const { t, lang } = useI18n();
  const { id } = useParams<{ id: string }>();
  const [activeImg, setActiveImg] = useState(0);
  const [template, setTemplate] = useState<any>(null);
  const [relatedTemplates, setRelatedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

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
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold mb-4">{t.templateDetail.notFound}</h2>
        <Link to="/templates" className="text-primary hover:underline">
          {t.templateDetail.backToAll}
        </Link>
      </div>
    );
  }

  const name = lang === "ar" 
    ? (template.title_ar || template.name_ar || template.nameAr || template.title || template.name) 
    : (template.title || template.name);

  const description = lang === "ar" 
    ? (template.description_ar || template.descriptionAr || template.description) 
    : (template.description);

  const previewImages = Array.isArray(template.preview_images) 
    ? template.preview_images 
    : Array.isArray(template.previewImages) 
      ? template.previewImages 
      : [template.image_url || template.image || ""];

  const demo_url = template.demo_url || template.demoUrl;

  if (previewImages.length === 0)
    previewImages.push("https://placehold.co/800x600?text=No+Image");

  return (
    <div className="min-h-screen bg-background pt-20" dir={lang === "ar" ? "rtl" : "ltr"}>
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
              <ChevronLeft size={14} strokeWidth={3} className={lang === 'ar' ? 'rotate-180' : ''} />
              {t.templateDetail.returnToGallery}
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
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.05] transition-all shadow-2xl"
                >
                  <Eye size={18} />
                  {t.templateDetail.liveDemo}
                </button>
              </div>
              {/* Badges */}
              <div className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} flex flex-col gap-2`}>
                {template.isFeatured && (
                  <span className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                    {t.templateDetail.featuredAsset}
                  </span>
                )}
                {template.isNew && (
                  <span className="px-4 py-2 bg-olive-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                    {t.templateDetail.newArrival}
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
              {previewImages.slice(0, 4).map((img: string, i: number) => (
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
                    className={`flex items-center gap-4 p-6 bg-card rounded-2xl border border-border group hover:border-primary transition-colors ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}
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
                    className={`flex items-center gap-4 p-6 bg-card rounded-2xl border border-border group hover:border-primary/30 transition-colors ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}
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
              <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8 sm:p-10">
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
                  <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 ${lang === 'ar' ? '-translate-x-1/2' : 'translate-x-1/2'}`} />
                  <div className="relative z-10">
                    <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">
                       {t.templateDetail.investment}
                    </div>
                    <div className="text-5xl font-black text-foreground tracking-tighter">
                      ${template.price}
                    </div>
                    {template.originalPrice && (
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-sm text-muted-foreground line-through font-bold">
                          {t.templateDetail.was} ${template.originalPrice}
                        </span>
                        <span className="px-3 py-1 bg-olive-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {t.templateDetail.save}{" "}
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
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center justify-center w-full py-5 bg-muted text-primary border border-primary/20 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em]">
                      <Eye size={18} strokeWidth={3} />
                      {t.templateDetail.livePreview}
                    </div>
                  </button>

                  <Link
                    to={`/order?templateId=${template._id || template.id}&type=template_purchase`}
                    className="flex flex-col items-center justify-center w-full py-6 bg-primary text-primary-foreground rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em]">
                      <ShoppingCart size={18} strokeWidth={3} />
                      {t.templateDetail.buyAsset}
                    </div>
                    <span className="text-[10px] text-primary-foreground/60 font-bold uppercase tracking-widest mt-1">
                      {t.templateDetail.instantAccess}
                    </span>
                  </Link>

                  <Link
                    to={`/order?templateId=${template._id || template.id}&type=template_modification`}
                    className="flex flex-col items-center justify-center w-full py-5 bg-muted border border-border text-foreground rounded-2xl hover:border-primary/30 hover:bg-card transition-all duration-300"
                  >
                    <div className="font-black text-xs uppercase tracking-[0.2em]">
                      {t.templateDetail.customSetup}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 text-center">
                      {t.templateDetail.readyIn}
                    </span>
                  </Link>
                </div>

                {/* Specs List */}
                <div className="space-y-6 pt-10 border-t border-border">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                      {t.templateDetail.architecture}
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
                    <div className={`flex items-center gap-3 text-xs font-bold text-foreground/80 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <Check
                        size={16}
                        className="text-primary flex-shrink-0"
                        strokeWidth={3}
                      />
                      {t.templateDetail.qa}
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-bold text-foreground/80 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <Check
                        size={16}
                        className="text-primary flex-shrink-0"
                        strokeWidth={3}
                      />
                      {t.templateDetail.supportPriority}
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
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 ${lang === 'ar' ? 'text-right' : ''}`}>
              <h2
                data-aos="fade-up"
                className="text-3xl font-black text-foreground tracking-tighter"
              >
                 {t.templateDetail.similarMasterpieces.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t.templateDetail.similarMasterpieces.split(' ').slice(-1)}</span>
              </h2>
              <Link
                to="/templates"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.3em] transition-all"
              >
                {t.templateDetail.viewEntireGallery}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedTemplates.map((tpl, i) => (
                <Link
                  key={tpl.id || tpl._id}
                  to={`/templates/${tpl.id || tpl._id}`}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="group relative bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted m-2">
                    <img
                      src={tpl.image_url || tpl.image || (Array.isArray(tpl.preview_images) ? tpl.preview_images[0] : null)}
                      alt={lang === 'ar' ? (tpl.title_ar || tpl.name_ar || tpl.nameAr || tpl.title) : (tpl.title || tpl.name)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay & Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                      <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                        {lang === 'ar' 
                          ? (tpl.title_ar || tpl.name_ar || tpl.nameAr || tpl.title || tpl.name) 
                          : (tpl.title || tpl.name)}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPreview && demo_url && (
          <TemplatePreview 
            url={demo_url} 
            title={name} 
            onClose={() => setShowPreview(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
