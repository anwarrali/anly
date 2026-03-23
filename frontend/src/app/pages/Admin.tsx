import { useEffect, useState } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  LayoutDashboard,
  LayoutGrid,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  TrendingDown,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Bell,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Package,
  UserCheck,
  MoreVertical,
  ArrowUpRight,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useAuth } from "../context/AuthContext";
import api from "../../utils/api";

type AdminTab = "overview" | "templates" | "orders" | "users" | "settings";

const statusConfig: Record<string, any> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: TrendingUp,
  },
  inProgress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: TrendingUp,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-indigo-100 text-primary",
    icon: CheckCircle2,
  },
  review: {
    label: "Review",
    color: "bg-purple-100 text-purple-700",
    icon: Eye,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const revenueChart = [
  { month: "Sep", value: 3200 },
  { month: "Oct", value: 4800 },
  { month: "Nov", value: 3900 },
  { month: "Dec", value: 6200 },
  { month: "Jan", value: 5100 },
  { month: "Feb", value: 7400 },
  { month: "Mar", value: 8520 },
];
const maxRevenue = Math.max(...revenueChart.map((d) => d.value));

export default function Admin() {
  const { t, lang } = useI18n();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const [templates, setTemplates] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    revenue: "$0",
    orders: 0,
    users: 0,
    templates: 0,
    revenueChange: "0%",
    ordersChange: "0%",
    usersChange: "0%",
    templatesChange: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingZip, setIsUploadingZip] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: "",
    title_ar: "",
    category: "business",
    price: "",
    original_price: "",
    image_url: "",
    demo_url: "",
    description: "",
    description_ar: "",
    is_featured: false,
    is_new_item: true,
    download_url: "",
    template_file_url: "",
    preview_images: "",
    tags: "",
    tech_stack: "",
    features: "",
    includes: ""
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setSavingSettings(true);
      await api.put("/auth/profile", profile);
      alert("Admin profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      if (!window.confirm("Update order status?")) return;
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert("Failed to update status");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this template?"))
        return;
      await api.delete(`/templates/${id}`);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete template");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      if (!window.confirm("Delete this user?")) return;
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete user");
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const res = await api.post("/templates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTemplateForm((prev) => ({ ...prev, image_url: res.data.data.url }));
    } catch (err: any) {
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items[0];
    if (item?.type.includes("image")) {
      const file = item.getAsFile();
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          setIsUploading(true);
          const res = await api.post("/templates/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setTemplateForm((prev) => ({ ...prev, image_url: res.data.data.url }));
        } catch (err: any) {
          alert("Failed to upload pasted image");
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["zip", "rar", "7z"].includes(ext || "")) {
      alert("Please upload a ZIP, RAR or 7Z file.");
      return;
    }

    try {
      setIsUploadingZip(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/templates/upload-zip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTemplateForm((prev) => ({ ...prev, template_file_url: res.data.data.path }));
      alert("ZIP file uploaded successfully!");
    } catch (err: any) {
      console.error("ZIP upload failed", err);
      alert(err.response?.data?.message || "Failed to upload ZIP file");
    } finally {
      setIsUploadingZip(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...templateForm,
      preview_images: templateForm.preview_images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: templateForm.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tech_stack: templateForm.tech_stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      features: templateForm.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      includes: templateForm.includes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      price: parseFloat(templateForm.price) || 0,
      original_price: templateForm.original_price ? parseFloat(templateForm.original_price) : null
    };

    try {
      if (editingTemplate) {
        await api.put(
          `/templates/${editingTemplate._id || editingTemplate.id}`,
          payload,
        );
      } else {
        await api.post("/templates", payload);
      }
      setTemplateModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error("Save template failed", err);
      alert(err.response?.data?.message || "Failed to save template");
    }
  };

  const openAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      title: "",
      title_ar: "",
      category: "business",
      price: "",
      original_price: "",
      image_url: "",
      demo_url: "",
      description: "",
      description_ar: "",
      is_featured: false,
      is_new_item: true,
      download_url: "",
      template_file_url: "",
      preview_images: "",
      tags: "",
      tech_stack: "",
      features: "",
      includes: ""
    });
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (tpl: any) => {
    setEditingTemplate(tpl);
    setTemplateForm({
      title: tpl.title || "",
      title_ar: tpl.title_ar || "",
      category: tpl.category || "business",
      price: tpl.price?.toString() || "",
      original_price: tpl.original_price?.toString() || "",
      image_url: tpl.image_url || "",
      demo_url: tpl.demo_url || "",
      description: tpl.description || "",
      description_ar: tpl.description_ar || "",
      is_featured: !!tpl.is_featured,
      is_new_item: tpl.is_new_item !== undefined ? !!tpl.is_new_item : true,
      download_url: tpl.download_url || "",
      template_file_url: tpl.template_file_url || "",
      preview_images: Array.isArray(tpl.preview_images) ? tpl.preview_images.join(", ") : "",
      tags: Array.isArray(tpl.tags) ? tpl.tags.join(", ") : "",
      tech_stack: Array.isArray(tpl.tech_stack) ? tpl.tech_stack.join(", ") : "",
      features: Array.isArray(tpl.features) ? tpl.features.join(", ") : "",
      includes: Array.isArray(tpl.includes) ? tpl.includes.join(", ") : ""
    });
    setTemplateModalOpen(true);
  };

  useEffect(() => {
    AOS.init({ duration: 500, once: true, easing: "ease-out-cubic" });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const [statsRes, usersRes, templatesRes, ordersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/templates"),
        api.get("/orders"),
      ]);
      const st = statsRes.data.data || {};
      setStats({
        revenue: `${st.revenue || 0}`,
        orders: st.totalOrders || 0,
        users: st.totalUsers || 0,
        templates: st.totalTemplates || 0,
        revenueChange: "+0%",
        ordersChange: "+0%",
        usersChange: "+0%",
        templatesChange: "+0%",
      });
      setUsers(
        Array.isArray(usersRes.data?.data?.users)
          ? usersRes.data.data.users
          : [],
      );
      setTemplates(
        Array.isArray(templatesRes.data?.data?.templates)
          ? templatesRes.data.data.templates
          : [],
      );
      setOrders(
        Array.isArray(ordersRes.data?.data?.orders)
          ? ordersRes.data.data.orders
          : [],
      );
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const navItems: {
    key: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    { key: "overview", label: t.admin.nav.overview, icon: LayoutDashboard },
    { key: "templates", label: t.admin.nav.templates, icon: LayoutGrid },
    { key: "orders", label: t.admin.nav.orders, icon: ShoppingBag },
    { key: "users", label: t.admin.nav.users, icon: Users },
    { key: "settings", label: t.admin.nav.settings, icon: Settings },
  ];

  const statsCards = [
    {
      label: t.admin.stats.revenue,
      value: stats.revenue,
      change: stats.revenueChange,
      icon: DollarSign,
      positive: true,
      color: "from-indigo-500 to-blue-500",
      bg: "bg-primary/10 border border-primary/20 text-primary",
    },
    {
      label: t.admin.stats.orders,
      value: stats.orders,
      change: stats.ordersChange,
      icon: ShoppingBag,
      positive: true,
      color: "from-purple-500 to-indigo-600",
      bg: "bg-purple-50",
    },
    {
      label: t.admin.stats.users,
      value: stats.users,
      change: stats.usersChange,
      icon: UserCheck,
      positive: true,
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
    },
    {
      label: t.admin.stats.templates,
      value: stats.templates,
      change: stats.templatesChange,
      icon: Package,
      positive: true,
      color: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
    },
  ];

  const filteredTemplates = (Array.isArray(templates) ? templates : []).filter(
    (tpl) =>
      (tpl.name || tpl.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (tpl.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(
    (order) =>
      (order._id || order.id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.serviceType || order.service || "--")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-background pt-16">
      {/* ADD/EDIT TEMPLATE MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border-border rounded-[2rem] shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTemplate ? t.admin.actions.editTemplate : t.admin.actions.addTemplate}
              </h2>
              <button onClick={() => setTemplateModalOpen(false)}>
                <XCircle size={24} className="text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.admin.form.titleEn}</label>
                  <input
                    required
                    placeholder="E-commerce Pro"
                    className="w-full border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    value={templateForm.title}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-oswald tracking-widest text-primary uppercase text-[10px]">{t.admin.form.titleAr}</label>
                  <input
                    required
                    placeholder="متجر الكتروني احترافي"
                    className="w-full border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 font-bold"
                    value={templateForm.title_ar}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, title_ar: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.admin.form.category}
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full border border-border rounded-lg px-4 py-3 bg-background-secondary text-foreground appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer pr-10"
                    value={templateForm.category}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="business">{t.admin.categories.business}</option>
                    <option value="portfolio">{t.admin.categories.portfolio}</option>
                    <option value="ecommerce">{t.admin.categories.ecommerce}</option>
                    <option value="blog">{t.admin.categories.blog}</option>
                    <option value="landing">{t.admin.categories.landing}</option>
                    <option value="restaurant">{t.admin.categories.restaurant}</option>
                    <option value="other">{t.admin.categories.other}</option>
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.admin.form.descriptionEn}</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Main template description..."
                    className="w-full border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                    value={templateForm.description}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-oswald tracking-widest text-primary uppercase text-[10px]">{t.admin.form.descriptionAr}</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="وصف القالب باللغة العربية..."
                    className="w-full border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 font-bold"
                    value={templateForm.description_ar}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        description_ar: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t.admin.form.price}
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={templateForm.price}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t.admin.form.originalPrice}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    value={templateForm.original_price}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        original_price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                    checked={templateForm.is_featured}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        is_featured: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {t.admin.form.featured}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                    checked={templateForm.is_new_item}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        is_new_item: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {t.admin.form.newRelease}
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t.admin.form.demoUrl}
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/demo"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={templateForm.demo_url}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        demo_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t.admin.form.previewImages}
                  </label>
                  <input
                    type="text"
                    placeholder="url1, url2, url3"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={templateForm.preview_images}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        preview_images: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.admin.form.techStack}
                </label>
                <input
                  type="text"
                  placeholder="React, Tailwind, MongoDB"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={templateForm.tech_stack}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      tech_stack: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.admin.form.features}
                </label>
                <textarea
                  rows={2}
                  placeholder="Responsive Design, Dark Mode, SEO Ready"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={templateForm.features}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      features: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.admin.form.includes}
                </label>
                <textarea
                  rows={2}
                  placeholder="Source Code, Documentation, 1 Year Updates"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={templateForm.includes}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      includes: e.target.value,
                    })
                  }
                />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">
                  Template ZIP File (Secure Storage)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="No ZIP file uploaded"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-muted-foreground italic"
                      value={templateForm.template_file_url}
                    />
                  </div>
                  <label className="flex-shrink-0 cursor-pointer px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all border border-indigo-100">
                    {isUploadingZip ? "Uploading..." : "Upload ZIP"}
                    <input
                      type="file"
                      className="hidden"
                      accept=".zip,.rar,.7z"
                      onChange={handleZipUpload}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Users can securely download this file after successful
                  purchase.
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">
                  Download Link (External/Alternative)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/template.zip"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={templateForm.download_url}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      download_url: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <div className="flex flex-col gap-3" onPaste={handlePaste}>
                  {templateForm.image_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-background">
                      <img
                        src={templateForm.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Paste image URL here..."
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                        value={templateForm.image_url}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <label
                      className={`cursor-pointer flex items-center justify-center w-12 h-12 bg-primary/10 border border-primary/20 text-primary hover:bg-indigo-100 text-xs font-black text-primary uppercase tracking-widest rounded-xl transition-all ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isUploading ? (
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus size={20} />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all"
                >
                  {t.admin.form.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t.admin.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row" dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:min-h-screen bg-card border-border border-b lg:border-e lg:border-b-0 shadow-3xl shadow-olive-200/5 lg:fixed top-16 bottom-0 overflow-y-auto z-40">
          {/* Admin Badge */}
          <div className="p-5 border-b border-border hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[1rem] bg-foreground text-background flex items-center justify-center font-black text-xl">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-black text-foreground uppercase tracking-tight text-sm">
                  {user?.name || t.admin.title}
                </p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">
                  Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-3 flex overflow-x-auto lg:flex-col custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 lg:mb-1 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest"
                      : "text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span className="max-lg:hidden">{item.label}</span>
                  {item.key === "orders" && (
                    <span className="ms-auto px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-semibold max-lg:hidden">
                      {orders.filter((o: any) => o.status === "pending").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 lg:border-t border-border lg:mt-4 flex lg:flex-col gap-2 overflow-x-auto custom-scrollbar">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground rounded-xl hover:bg-background hover:text-foreground transition-colors"
            >
              <ArrowUpRight size={18} />
              <span className="max-lg:hidden">View Site</span>
            </Link>
            <button
              onClick={logout}
              className="flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              <span className="max-lg:hidden">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ms-64 p-4 lg:p-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="relative w-full sm:w-auto">
              <Search
                size={16}
                className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full sm:w-64 ps-10 pe-4 py-2.5 bg-card border-border border border-border rounded-xl text-sm text-xl font-black text-foreground uppercase tracking-tight placeholder-gray-400 focus:outline-none focus:ring-4 focus:outline-none focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button className="relative p-2.5 bg-card border-border rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-xs font-black text-primary uppercase tracking-widest transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-foreground border border-border flex items-center justify-center text-white text-sm font-bold uppercase lg:hidden">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>

          {loading && (
            <div className="p-4 bg-card border-border rounded-xl shadow mt-4 mb-4 text-center">
              Loading data...
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl mt-4 mb-4 border border-red-200 flex items-center gap-2">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <div data-aos="fade-up" className="mb-8">
                <h1 className="text-2xl font-bold text-xl font-black text-foreground uppercase tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Welcome back, {user?.name?.split(" ")[0] || "Admin"}! Here's
                  what's happening today.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statsCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      data-aos="fade-up"
                      data-aos-delay={i * 60}
                      className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}
                        >
                          <Icon
                            size={20}
                            className="text-xs font-black text-primary uppercase tracking-widest"
                          />
                        </div>
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            card.positive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {card.positive ? (
                            <TrendingUp size={13} />
                          ) : (
                            <TrendingDown size={13} />
                          )}
                          {card.change}
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-xl font-black text-foreground uppercase tracking-tight mb-1">
                        {card.value}
                      </div>
                      <div className="text-xs text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {card.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Revenue Chart */}
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl font-black text-foreground uppercase tracking-tight">
                    Revenue Overview
                  </h3>
                  <select className="text-xs bg-background border border-border rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground focus:outline-none cursor-pointer">
                    <option>Last 7 months</option>
                    <option>Last 12 months</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 h-40">
                  {revenueChart.map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-700 hover:from-indigo-500 hover:to-purple-400 cursor-pointer relative group"
                        style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${d.value.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {d.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders + Top Templates */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div
                  data-aos="fade-right"
                  data-aos-delay="200"
                  className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="font-bold text-xl font-black text-foreground uppercase tracking-tight">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-xs font-black text-primary uppercase tracking-widest font-semibold hover:text-primary"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 4).map((order: any) => {
                      const status =
                        statusConfig[order.status] || statusConfig.pending;
                      return (
                        <div
                          key={order._id || order.id}
                          className="flex items-center gap-4 p-4"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-xl font-black text-foreground uppercase tracking-tight truncate">
                              #{order._id || order.id}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {order.serviceType || order.service || "--"}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
                          >
                            {status.label}
                          </span>
                          <span className="text-sm font-bold text-xl font-black text-foreground uppercase tracking-tight">
                            ${order.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  data-aos="fade-left"
                  data-aos-delay="200"
                  className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="font-bold text-xl font-black text-foreground uppercase tracking-tight">
                      Top Templates
                    </h3>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className="text-xs text-xs font-black text-primary uppercase tracking-widest font-semibold hover:text-primary"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {templates.slice(0, 4).map((tpl: any) => (
                      <div
                        key={tpl._id || tpl.id}
                        className="flex items-center gap-4 p-4"
                      >
                        <img
                          src={
                            tpl.image ||
                            tpl.previewImages?.[0] ||
                            "https://placehold.co/400"
                          }
                          alt={tpl.title || tpl.name}
                          className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-xl font-black text-foreground uppercase tracking-tight truncate">
                            {tpl.title || tpl.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star
                              size={10}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="text-xs text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {tpl.rating} ({tpl.reviews})
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-xs font-black text-primary uppercase tracking-widest">
                          ${tpl.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div>
              <div
                data-aos="fade-up"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
              >
                <div>
                  <h1 className="text-2xl font-bold text-xl font-black text-foreground uppercase tracking-tight">
                    Manage Templates
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {templates.length} templates in total
                  </p>
                </div>
                <button
                  onClick={openAddTemplate}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
                >
                  <Plus size={16} />
                  {t.admin.actions.addTemplate}
                </button>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <div className="relative flex-1 max-w-xs">
                    <Search
                      size={14}
                      className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full ps-9 pe-4 py-2 border border-border rounded-xl text-sm text-xl font-black text-foreground uppercase tracking-tight placeholder-gray-400 focus:outline-none focus:ring-4 focus:outline-none focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-indigo-200 hover:text-xs font-black text-primary uppercase tracking-widest transition-all">
                    <Filter size={14} />
                    <span className="max-sm:hidden">Filter</span>
                    <ChevronDown size={13} />
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-background border-b border-border">
                        {[
                          "Template",
                          "Category",
                          "Price",
                          "Rating",
                          "Reviews",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-start text-xs font-semibold text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTemplates.map((tpl: any) => (
                        <tr
                          key={tpl._id || tpl.id}
                          className="hover:bg-background/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  tpl.image ||
                                  tpl.previewImages?.[0] ||
                                  "https://placehold.co/400"
                                }
                                alt={tpl.title || tpl.name}
                                className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-border"
                              />
                              <div>
                                <p className="text-sm font-semibold text-xl font-black text-foreground uppercase tracking-tight line-clamp-1">
                                  {tpl.title || tpl.name}
                                </p>
                                <div className="flex gap-1 mt-0.5">
                                  {tpl.featured && (
                                    <span className="px-1.5 py-0.5 text-xs bg-indigo-100 text-xs font-black text-primary uppercase tracking-widest rounded font-medium">
                                      Featured
                                    </span>
                                  )}
                                  {tpl.new && (
                                    <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-600 rounded font-medium">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground text-xs rounded-lg font-medium capitalize whitespace-nowrap">
                              {tpl.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div>
                              <span className="text-sm font-bold text-xl font-black text-foreground uppercase tracking-tight">
                                ${tpl.price}
                              </span>
                              {tpl.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through ms-1">
                                  ${tpl.originalPrice}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <Star
                                size={12}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span className="text-sm font-medium text-foreground">
                                {tpl.rating}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {tpl.reviews}
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                              Active
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/templates/${tpl._id || tpl.id}`}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-xs font-black text-primary uppercase tracking-widest hover:bg-primary/10 border border-primary/20 text-primary transition-all"
                                title="View"
                              >
                                <Eye size={15} />
                              </Link>
                              {tpl.demoUrl && (
                                <a
                                  href={tpl.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-all"
                                  title="Live Demo"
                                >
                                  <ExternalLink size={15} />
                                </a>
                              )}
                              <button
                                onClick={() => openEditTemplate(tpl)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-all"
                                title={t.admin.actions.editTemplate}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTemplate(tpl._id || tpl.id)
                                }
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                                title={t.admin.actions.deleteTemplate}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <div
                data-aos="fade-up"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
              >
                <div>
                  <h1 className="text-2xl font-bold text-xl font-black text-foreground uppercase tracking-tight">
                    Manage Orders
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {orders.length} orders total
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(statusConfig).map(([key, val]) => {
                    const count = orders.filter(
                      (o: any) => o.status === key,
                    ).length;
                    return count > 0 ? (
                      <span
                        key={key}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${val.color}`}
                      >
                        {val.label}: {count}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 overflow-hidden"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-background border-b border-border">
                        {[
                          "Order ID",
                          "Service",
                          "Template",
                          "Status",
                          "Date",
                          "Amount",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-start text-xs font-semibold text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.map((order: any) => {
                        const status =
                          statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        return (
                          <tr
                            key={order._id || order.id}
                            className="hover:bg-background/50 transition-colors"
                          >
                            <td className="px-5 py-4 text-sm font-mono font-medium text-xl font-black text-foreground uppercase tracking-tight whitespace-nowrap">
                              {order._id || order.id}
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-xl font-black text-foreground uppercase tracking-tight whitespace-nowrap">
                              {order.serviceType || order.service || "--"}
                            </td>
                            <td className="px-5 py-4 text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground max-w-[150px] truncate">
                              {order.template || "—"}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                              >
                                <StatusIcon size={11} />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : order.date}
                            </td>
                            <td className="px-5 py-4 text-sm font-bold text-xl font-black text-foreground uppercase tracking-tight">
                              {order.amount === 0 ? "TBD" : `$${order.amount}`}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(
                                      order._id || order.id,
                                      e.target.value,
                                    )
                                  }
                                  className="text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground focus:outline-none cursor-pointer hover:border-indigo-300 transition-colors"
                                >
                                  {Object.keys(statusConfig).map((k) => (
                                    <option key={k} value={k}>
                                      {statusConfig[k].label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div
                data-aos="fade-up"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
              >
                <div>
                  <h1 className="text-2xl font-bold text-xl font-black text-foreground uppercase tracking-tight">
                    Manage Users
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {users.length} registered users
                  </p>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 overflow-hidden"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-background border-b border-border">
                        {[
                          "User",
                          "Email",
                          "Orders",
                          "Total Spent",
                          "Joined",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-start text-xs font-semibold text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map((u: any) => (
                        <tr
                          key={u._id || u.id}
                          className="hover:bg-background/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-foreground border border-border flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {(u.name || "?").charAt(0)}
                              </div>
                              <span className="text-sm font-semibold text-xl font-black text-foreground uppercase tracking-tight whitespace-nowrap">
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {u.email}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-xl font-black text-foreground uppercase tracking-tight">
                            {u.orders || 0}
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-xl font-black text-foreground uppercase tracking-tight">
                            ${0}
                          </td>
                          <td className="px-5 py-4 text-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                (u.isActive !== false
                                  ? "active"
                                  : "inactive") === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                              }`}
                            >
                              {u.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteUser(u._id || u.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Delete User"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <div data-aos="fade-up" className="mb-8">
                <h1 className="text-2xl font-bold text-xl font-black text-foreground uppercase tracking-tight">
                  Platform Settings
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Configure your platform preferences.
                </p>
              </div>

              <div className="space-y-6">
                <div
                  data-aos="fade-up"
                  className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 p-6"
                >
                  <h3 className="font-bold text-xl font-black text-foreground uppercase tracking-tight mb-5">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Admin Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm text-xl font-black text-foreground uppercase tracking-tight focus:outline-none focus:ring-4 focus:outline-none focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm text-xl font-black text-foreground uppercase tracking-tight focus:outline-none focus:ring-4 focus:outline-none focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingSettings}
                    className="mt-5 w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
                  >
                    {savingSettings ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* Feature Toggles */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 shadow-3xl shadow-olive-200/5 p-6"
                >
                  <h3 className="font-bold text-xl font-black text-foreground uppercase tracking-tight mb-5">
                    Feature Toggles
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Enable new user registrations",
                        sub: "Allow new users to create accounts",
                      },
                      {
                        label: "Maintenance mode",
                        sub: "Take the platform offline for maintenance",
                      },
                      {
                        label: "Template reviews",
                        sub: "Allow customers to leave template reviews",
                      },
                      {
                        label: "Email notifications",
                        sub: "Send email updates for order changes",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-xl gap-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-xl font-black text-foreground uppercase tracking-tight">
                            {item.label}
                          </p>
                          <p className="text-xs text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                            {item.sub}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer max-sm:self-end">
                          <input
                            type="checkbox"
                            defaultChecked={i !== 1}
                            className="SR-ONLY peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 focus:outline-none peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-card border-border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
