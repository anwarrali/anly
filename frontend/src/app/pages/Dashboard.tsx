import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Settings,
  Bell,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Package,
  FileText,
  LogOut,
  User,
  Send,
  Download,
  Edit3,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useAuth } from "../context/AuthContext";
import api from "../../utils/api";

type Tab = "overview" | "orders" | "settings";

const statusConfig: Record<string, any> = {
  pending: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    icon: Clock,
  },
  inProgress: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    icon: TrendingUp,
  },
  completed: {
    label: "Completed",
    color: "bg-primary/10 text-primary border border-primary/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-600 border border-red-500/20",
    icon: XCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-primary/10 text-primary border border-primary/20",
    icon: CheckCircle2,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "+1 555 000 0000",
    company: "Acme Inc.",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      const orderData = res.data?.data?.orders || res.data?.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch {
      // fallback
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSavingSettings(true);
      const res = await api.put("/auth/profile", {
        name: profile.name,
        email: profile.email,
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDownload = async (templateId: string, title: string) => {
    try {
      const res = await api.get(`/templates/download/${templateId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title.replace(/\s+/g, "_")}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error("Download failed", err);
      alert("Download failed. Please try again or contact support.");
    }
  };

  const handleRequestEdit = async (orderId: string) => {
    try {
      const res = await api.post(`/orders/${orderId}/request-edit`);
      alert(t.dashboard.orders.successMessage);
      fetchOrders();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to request edit. Try again.";
      if (msg.toLowerCase().includes("limit reached")) {
        if (confirm(`${t.dashboard.orders.upgradePrompt}`)) {
          navigate("/services");
        }
      } else {
        alert(msg);
      }
    }
  };

  useEffect(() => {
    AOS.init({ duration: 500, once: true, easing: "ease-out-cubic" });
  }, []);

  const navItems: { key: Tab; label: string; icon: typeof LayoutDashboard }[] =
    [
      {
        key: "overview",
        label: t.dashboard.nav.overview,
        icon: LayoutDashboard,
      },
      { key: "orders", label: t.dashboard.nav.orders, icon: ShoppingBag },
      { key: "settings", label: t.dashboard.nav.settings, icon: Settings },
    ];

  const statsCards = [
    {
      label: t.dashboard.stats.totalOrders,
      value: orders?.length || 0,
      icon: Package,
    },
    {
      label: t.dashboard.stats.activeProjects,
      value: (orders || []).filter((o) => o.status === "inProgress").length,
      icon: TrendingUp,
    },
    {
      label: t.dashboard.stats.completedProjects,
      value: (orders || []).filter((o) => o.status === "completed").length,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Background Decorative */}
      <div className="absolute top-0 inset-x-0 h-[300px] overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-card rounded-[2rem] border border-border shadow-3xl shadow-olive-200/5 overflow-hidden sticky top-28">
              {/* User Info */}
              <div className="p-8 bg-foreground">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[1.25rem] bg-primary/20 flex items-center justify-center text-primary text-3xl font-black uppercase mb-4 border border-primary/30 shadow-xl">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-background font-black text-xl tracking-tight mb-1">
                      {user?.name || "User"}
                    </p>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                      }`}
                    >
                      <Icon size={18} strokeWidth={3} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-border bg-muted/30">
                <Link
                  to="/order"
                  className="flex items-center gap-4 px-5 py-4 text-primary bg-primary/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-colors mb-2 border border-primary/10"
                >
                  <ShoppingBag size={18} strokeWidth={3} />
                  Initiate Order
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-5 py-4 text-foreground/60 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted hover:text-foreground transition-colors border border-transparent"
                >
                  <LogOut size={18} strokeWidth={3} />
                  Disconnect
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-12">
                <div
                  data-aos="fade-up"
                  className="flex items-end justify-between"
                >
                  <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">
                      {t.dashboard.welcome},{" "}
                      <span className="text-primary">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                    </h1>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                      Operational Overview & Status Report
                    </p>
                  </div>
                  <button className="w-12 h-12 bg-card rounded-2xl border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                    <Bell size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {statsCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={i * 100}
                        className="bg-card rounded-[2rem] border border-border p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-muted text-primary flex items-center justify-center mb-6 border border-border">
                            <Icon size={24} strokeWidth={2.5} />
                          </div>
                          <div className="text-5xl font-black text-foreground tracking-tighter mb-2">
                            {card.value}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {card.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                      Active Deployments
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      View All <ChevronRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(orders || []).slice(0, 3).map((order) => {
                      const status =
                        statusConfig[order.status] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      return (
                        <div
                          key={order._id || order.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-muted rounded-[1.5rem] border border-transparent hover:border-border transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center flex-shrink-0 shadow-sm border border-border text-primary">
                            <FileText size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-black text-foreground truncate uppercase tracking-tight mb-1">
                              {lang === "ar" ? order.serviceAr : order.service}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              ID: {order._id || order.id} •{" "}
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : order.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 sm:mt-0">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${status.color}`}
                            >
                              <StatusIcon size={14} strokeWidth={3} />
                              {t.dashboard.orders.statuses[
                                order.status as keyof typeof t.dashboard.orders.statuses
                              ] || order.status}
                            </span>
                            <span className="text-lg font-black tracking-tighter text-foreground">
                              ${order.amount}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {(!orders || orders.length === 0) && (
                      <div className="text-center py-12 bg-muted rounded-[1.5rem]">
                        <p className="text-sm font-bold text-muted-foreground">
                          No active deployments identified.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div data-aos="fade-up" data-aos-delay="300">
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-6">
                    Execution Shortcuts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Link
                      to="/templates"
                      className="group p-8 bg-card rounded-[2rem] border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col items-start gap-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Package size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg uppercase tracking-tight mb-1">
                          Gallery
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Discover Assets
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/order"
                      className="group p-8 bg-card rounded-[2rem] border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col items-start gap-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-olive-500/10 flex items-center justify-center text-olive-600 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg uppercase tracking-tight mb-1">
                          Deploy
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Initialize Sequence
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/services"
                      className="group p-8 bg-card rounded-[2rem] border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col items-start gap-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                        <Send size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg uppercase tracking-tight mb-1">
                          Upgrades
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Scale Operations
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">
                    {t.dashboard.orders.title}
                  </h1>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    Manage your historical and active requests
                  </p>
                </div>

                <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 overflow-hidden">
                  <div className="overflow-x-auto p-4 sm:p-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          {[
                            "Identifier",
                            "Architecture",
                            "State",
                            "Timestamp",
                            "Capital",
                            "Operations",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-4 border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(orders || []).map((order) => {
                          const status =
                            statusConfig[order.status] || statusConfig.pending;
                          const StatusIcon = status.icon;
                          return (
                            <tr
                              key={order._id || order.id}
                              className="group hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-5 text-sm font-bold text-foreground border-b border-border/50">
                                ...{(order._id || order.id).slice(-6)}
                              </td>
                              <td className="px-6 py-5 border-b border-border/50">
                                <div>
                                  <p className="text-sm font-black text-foreground uppercase tracking-tight">
                                    {(order.serviceType || "template").replace(
                                      /_/g,
                                      " ",
                                    )}
                                  </p>
                                  {order.templateId && (
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                                      {order.templateId.title}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-5 border-b border-border/50">
                                <div className="flex flex-col gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit ${status?.color}`}
                                  >
                                    {StatusIcon && (
                                      <StatusIcon size={12} strokeWidth={3} />
                                    )}
                                    {t.dashboard.orders.statuses[
                                      order.status as keyof typeof t.dashboard.orders.statuses
                                    ] || order.status}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black uppercase tracking-[0.2em] ps-1 ${order.paymentStatus === "paid" ? "text-primary" : "text-amber-500"}`}
                                  >
                                    ● {order.paymentStatus}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50">
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()
                                  : order.date}
                              </td>
                              <td className="px-6 py-5 text-base font-black text-foreground tracking-tighter border-b border-border/50">
                                ${order.amount}
                              </td>
                              <td className="px-6 py-5 border-b border-border/50">
                                <div className="flex flex-col gap-3 min-w-[140px]">
                                  {order.serviceType === "template_purchase" &&
                                    order.paymentStatus === "paid" &&
                                    (order.templateId?.templateFile ||
                                      order.templateId?.downloadUrl) && (
                                      <button
                                        onClick={() => {
                                          if (order.templateId?.templateFile) {
                                            handleDownload(
                                              order.templateId._id ||
                                                order.templateId.id,
                                              order.templateId.title,
                                            );
                                          } else {
                                            window.open(
                                              order.templateId.downloadUrl,
                                              "_blank",
                                            );
                                          }
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
                                      >
                                        <Download size={14} strokeWidth={3} />
                                        Extract
                                      </button>
                                    )}
                                  {order.editLimit > 0 &&
                                    order.paymentStatus === "paid" && (
                                      <div className="flex flex-col gap-2 p-3 bg-muted rounded-xl border border-border hidden">
                                        {/* Simplified Edit Tracker for Professional Vibe */}
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                          <span>Mutations</span>
                                          <span className="text-foreground">
                                            {order.editCount}/
                                            {order.editLimit > 1000
                                              ? "∞"
                                              : order.editLimit}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleRequestEdit(
                                              order._id || order.id,
                                            )
                                          }
                                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all shadow-sm"
                                        >
                                          <Edit3 size={12} strokeWidth={3} />
                                          Request Task
                                        </button>
                                      </div>
                                    )}
                                  <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest w-fit">
                                    Analyze{" "}
                                    <ChevronRight size={14} strokeWidth={3} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Link
                    to="/order"
                    className="flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    <ShoppingBag size={18} strokeWidth={3} />
                    Execute New Order
                  </Link>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">
                    {t.dashboard.nav.settings}
                  </h1>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    Configure entity parameters
                  </p>
                </div>

                <div className="grid gap-8 max-w-4xl">
                  <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8 sm:p-12">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-8 flex items-center gap-3">
                      <User size={24} className="text-primary" /> Profile
                      Parameters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      {[
                        {
                          label: "Identity Name",
                          value: profile.name,
                          type: "text",
                          field: "name",
                        },
                        {
                          label: "Primary Comms",
                          value: profile.email,
                          type: "email",
                          field: "email",
                        },
                        {
                          label: "Telecom Vector",
                          value: profile.phone,
                          type: "tel",
                          field: "phone",
                        },
                        {
                          label: "Corporate Entity",
                          value: profile.company,
                          type: "text",
                          field: "company",
                        },
                      ].map((field) => (
                        <div key={field.label} className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-sm font-medium text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            value={field.value}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                [field.field]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingSettings}
                      className="flex items-center gap-3 px-8 py-4 bg-foreground text-background text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 min-w-[200px] justify-center"
                    >
                      {savingSettings ? (
                        <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 size={18} strokeWidth={3} />
                      )}
                      Sync Updates
                    </button>
                  </div>

                  <div className="bg-card rounded-[2.5rem] border border-border shadow-3xl shadow-olive-200/5 p-8 sm:p-12">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-8 flex items-center gap-3">
                      <Bell size={24} className="text-primary" /> Alert Triggers
                    </h3>
                    <div className="space-y-6">
                      {[
                        {
                          label: "Lifecycle State Shifts",
                          sub: "Ping upon deployment progression",
                        },
                        {
                          label: "Strategic Offerings",
                          sub: "Ping for high-value asset acquisitions",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-6 bg-muted rounded-[1.5rem] border border-border"
                        >
                          <div>
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">
                              {item.label}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                              {item.sub}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
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
    </div>
  );
}
