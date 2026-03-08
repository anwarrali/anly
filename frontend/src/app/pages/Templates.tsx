import { useEffect, useState } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  Star,
  ArrowRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  ShoppingCart,
} from "lucide-react";
import { useI18n } from "../../i18n";
import api from "../../utils/api";

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
  const [sortBy, setSortBy] = useState<
    "popular" | "price-asc" | "price-desc" | "newest"
  >("popular");

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    fetchTemplates();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [category, search]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/templates");
      const list = res.data?.data?.templates || res.data?.data || [];
      const templatesArray = Array.isArray(list) ? list : [];
      setDbTemplates(templatesArray);

      // Refresh AOS after a short delay to ensure elements are in the DOM
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.templates.categories.all },
    { key: "business", label: t.templates.categories.business },
    { key: "portfolio", label: t.templates.categories.portfolio },
    { key: "ecommerce", label: t.templates.categories.ecommerce },
    { key: "blog", label: t.templates.categories.blog },
    { key: "landing", label: t.templates.categories.landing },
    { key: "restaurant", label: t.templates.categories.restaurant },
    { key: "realEstate", label: t.templates.categories.realEstate },
    { key: "health", label: t.templates.categories.health },
    { key: "saas", label: t.templates.categories.saas },
  ];

  const filtered = dbTemplates
    .filter((tpl) => {
      const matchCat = category === "all" || tpl.category === category;
      const tplName = (tpl.title || tpl.name || "").toLowerCase();
      const matchSearch =
        search === "" ||
        tplName.includes(search.toLowerCase()) ||
        (tpl.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(search.toLowerCase()),
        );
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return (b.rating || 0) - (a.rating || 0);
    });

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="relative py-24 bg-background overflow-hidden border-b border-border">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olive-50/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span>{t.templates.badge}</span>
          </div>
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tight"
          >
            {t.templates.title}{" "}
            <span className="text-primary">{t.templates.titleHighlight}</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12"
          >
            {t.templates.subtitle}
          </p>

          {/* Search */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="relative max-w-xl mx-auto"
          >
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by category, name, or tags..."
              className="w-full pl-14 pr-6 py-5 bg-card border border-border text-foreground placeholder-muted-foreground rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-xl shadow-olive-200/5"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  category === cat.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-foreground border border-transparent hover:bg-card hover:border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1 lg:flex-none px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-muted border border-transparent rounded-2xl text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <div className="flex bg-muted p-1 rounded-2xl border border-transparent">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
            {loading ? (
              "Loading collections..."
            ) : (
              <>
                Discovered{" "}
                <span className="text-primary">{filtered.length}</span> Premium
                Templates
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs font-black text-primary uppercase tracking-widest animate-pulse">
              Initializing Library
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((tpl, i) => (
              <div
                key={tpl._id || tpl.id}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="group bg-card rounded-[2rem] overflow-hidden border border-border hover:shadow-3xl hover:shadow-olive-200/20 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={tpl.image}
                    alt={
                      lang === "ar"
                        ? tpl.nameAr || tpl.title || tpl.name
                        : tpl.title || tpl.name
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 gap-3">
                    <Link
                      to={`/templates/${tpl._id || tpl.id}`}
                      className="flex-1 text-center py-3 bg-card text-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-xl"
                    >
                      {t.templates.preview}
                    </Link>
                    {tpl.demoUrl && (
                      <a
                        href={tpl.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-all shadow-xl"
                      >
                        <ArrowRight size={18} className="-rotate-45" />
                      </a>
                    )}
                  </div>
                  <div className="absolute top-5 start-5 flex flex-col gap-2">
                    {tpl.isFeatured && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl">
                        Featured
                      </span>
                    )}
                    {tpl.isNewItem && (
                      <span className="px-3 py-1 bg-olive-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl">
                        New Arrival
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                        {lang === "ar"
                          ? tpl.nameAr || tpl.title || tpl.name
                          : tpl.title || tpl.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="text-xs text-foreground font-black">
                          {tpl.rating}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider ms-1">
                          ({tpl.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-black text-primary">
                        ${tpl.price}
                      </div>
                      {tpl.originalPrice && (
                        <div className="text-[10px] text-muted-foreground line-through font-bold">
                          ${tpl.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                    {lang === "ar"
                      ? tpl.descriptionAr || tpl.description
                      : tpl.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/order?templateId=${tpl._id || tpl.id}&type=template_purchase`}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      {t.templates.buyNow}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((tpl, i) => (
              <div
                key={tpl._id || tpl.id}
                data-aos="fade-up"
                data-aos-delay={i * 40}
                className="group flex flex-col md:flex-row bg-card rounded-[2.5rem] overflow-hidden border border-border hover:shadow-3xl hover:border-primary/20 transition-all duration-500"
              >
                <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={tpl.image}
                    alt={
                      lang === "ar"
                        ? tpl.titleAr || tpl.nameAr || tpl.title || tpl.name
                        : tpl.title || tpl.name
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 start-5">
                    {tpl.isFeatured && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-2xl font-black text-foreground">
                        {lang === "ar"
                          ? tpl.titleAr || tpl.nameAr || tpl.title || tpl.name
                          : tpl.title || tpl.name}
                      </h3>
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-xl border border-border">
                        <Star size={16} className="fill-primary text-primary" />
                        <span className="text-sm text-foreground font-black">
                          {tpl.rating}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold">
                          ({tpl.reviews})
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                      {lang === "ar"
                        ? tpl.descriptionAr || tpl.description
                        : tpl.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {tpl.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-primary">
                        ${tpl.price}
                      </span>
                      {tpl.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through font-bold">
                          Was ${tpl.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/templates/${tpl._id || tpl.id}`}
                        className="px-8 py-4 bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-card hover:border-border transition-all"
                      >
                        {t.templates.preview}
                      </Link>
                      <Link
                        to={`/order?templateId=${tpl._id || tpl.id}&type=template_purchase`}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all"
                      >
                        {t.templates.buyNow}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-40">
            <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center mx-auto mb-8 shadow-inner">
              <SlidersHorizontal size={36} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">
              Collection Exhausted
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-10 leading-relaxed">
              We couldn't find any templates matching your specific criteria.
            </p>
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
              className="px-10 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Reset Discovery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
