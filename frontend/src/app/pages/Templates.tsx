import { useEffect, useState } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  ChevronDown,
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";
import { motion } from "motion/react";

type Category =
  | "all"
  | "business"
  | "ecommerce"
  | "restaurant"
  | "portfolio"
  | "blog"
  | "landing"
  | "realEstate"
  | "health"
  | "saas";

export default function Templates() {
  const { t, lang } = useI18n();
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "newest">("popular");
  


  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/templates");
      const list = res.data?.data?.templates || res.data?.data || [];
      setDbTemplates(Array.isArray(list) ? list : []);
      setTimeout(() => AOS.refresh(), 100);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = dbTemplates
    .filter((tpl) => {
      const matchCat = category === "all" || tpl.category === category;
      const tplName = (tpl.title || tpl.name || "").toLowerCase();
      const matchSearch = search === "" || tplName.includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.rating || 0) - (a.rating || 0);
    });

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.templates.categories.all },
    { key: "portfolio", label: t.templates.categories.portfolio },
    { key: "business", label: t.templates.categories.business },
    { key: "ecommerce", label: t.templates.categories.ecommerce },
    { key: "restaurant", label: t.templates.categories.restaurant },
    { key: "landing", label: t.templates.categories.landing },
  ];



  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="relative py-32 bg-background-secondary overflow-hidden border-b border-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-px bg-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.templates.discovery}</span>
             </div>
            <h1 className="text-6xl sm:text-8xl font-black text-foreground mb-8 tracking-tighter uppercase font-oswald">
              {t.homeExtra.back} <span className="text-primary italic">{t.templates.collection}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium mb-12">
              {t.templates.architectureDesc}
            </p>

              <div className="relative max-w-xl w-full">
                <Search size={18} className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-muted-foreground`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.templates.searchPlaceholder}
                  className={`w-full ${lang === 'ar' ? 'pr-16 pl-8' : 'pl-16 pr-8'} py-6 bg-background border border-border text-foreground rounded-full focus:outline-none focus:border-accent transition-all font-medium shadow-sm`}
                />
              </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border rounded-full ${
                  category === cat.key ? "bg-accent text-black border-accent shadow-glow-accent" : "bg-transparent text-muted-foreground border-border hover:border-accent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="relative w-full lg:w-auto">
               <select 
                 value={sortBy} 
                 onChange={(e) => setSortBy(e.target.value as any)}
                 className={`w-full lg:w-64 bg-background-secondary border border-border ${lang === 'ar' ? 'pl-8 pr-12' : 'pl-12 pr-8'} py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground focus:outline-none focus:border-accent rounded-full appearance-none hover:border-accent transition-all cursor-pointer shadow-sm`}
               >
                 <option value="newest">{t.templates.sortBy.newest}</option>
                 <option value="popular">{t.templates.sortBy.popular}</option>
                 <option value="price-low">{t.templates.sortBy.priceLow}</option>
                 <option value="price-high">{t.templates.sortBy.priceHigh}</option>
               </select>
               <div className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 pointer-events-none text-primary`}>
                 <ChevronDown size={14} />
               </div>
             </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-background-secondary border border-border mb-6" />
                <div className="h-6 bg-background-secondary border border-border w-2/3 mb-4" />
                <div className="h-4 bg-background-secondary border border-border w-full mb-2" />
                <div className="h-4 bg-background-secondary border border-border w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-12">
            {filtered.map((tpl, i) => (
              <Link
                key={tpl.id || tpl._id}
                to={`/templates/${tpl.id || tpl._id}`}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="group relative flex flex-col h-full border border-border hover:border-accent rounded-[1.2rem] sm:rounded-[3rem] transition-all duration-500 overflow-hidden bg-card"
              >
                <div className="relative aspect-[3/4] sm:aspect-[4/3] overflow-hidden bg-background-secondary rounded-[1rem] sm:rounded-[2.5rem] m-1 sm:m-2">
                  <img 
                    src={tpl.image_url || tpl.image || (Array.isArray(tpl.preview_images) ? tpl.preview_images[0] : null)} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={lang === 'ar' ? (tpl.title_ar || tpl.name_ar || tpl.nameAr || tpl.title) : (tpl.title || tpl.name)}
                  />
                  
                  {/* Gradient Overlay & Title */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 sm:p-10 flex flex-col justify-end">
                    <h3 className="text-xs sm:text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight line-clamp-1 mb-0.5 sm:mb-2">
                      {lang === 'ar' 
                        ? (tpl.title_ar || tpl.name_ar || tpl.nameAr || tpl.title || tpl.name) 
                        : (tpl.title || tpl.name)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.3em] text-white/50">
                        {t.templates.categories[tpl.category as keyof typeof t.templates.categories] || tpl.category}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className={`absolute top-2 ${lang === 'ar' ? 'right-2' : 'left-2'} sm:top-6 sm: ${lang === 'ar' ? 'right-6' : 'left-6'} flex flex-col gap-1 sm:gap-2`}>
                    {(tpl.is_featured || tpl.isFeatured) && (
                      <span className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-accent text-white text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl backdrop-blur-md">
                        {t.templates.featured}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}
