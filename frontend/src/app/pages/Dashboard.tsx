import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import supabase from "../../utils/supabase";
import {
  Package,
  Clock,
  CheckCircle,
  Layout,
  ExternalLink,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Database,
  Cpu,
  Layers,
  FileCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  Zap,
  Mail,
} from "lucide-react";
import { useI18n } from "../../i18n";

interface Order {
  id: string;
  template_id?: string | { id: string; title: string; titleAr?: string };
  service_type: string;
  status: string;
  payment_status: string;
  amount: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "settings"
  >("overview");
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      const ordersRes = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setContacts([]); // Disabled contacts fetching as requested
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const stats = [
    {
      label: t.dashboard.stats.totalOrders,
      value: orders.length,
      icon: Package,
      color: "blue",
    },
    {
      label: t.dashboard.stats.activeProjects,
      value: orders.filter((o) => o.status !== "completed").length,
      icon: Clock,
      color: "orange",
    },
    {
      label: t.dashboard.stats.completedProjects,
      value: orders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "green",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          {t.auth.initializing}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background pt-24 pb-12"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                  {user?.name?.[0]?.toUpperCase() || "C"}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tighter leading-none mb-1.5">
                    {user?.name}
                  </h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest line-clamp-1">
                    {user?.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  {
                    id: "overview",
                    label: t.dashboard.nav.overview,
                    icon: Layers,
                  },
                  {
                    id: "orders",
                    label: t.dashboard.nav.orders,
                    icon: Database,
                  },
                  {
                    id: "settings",
                    label: t.dashboard.nav.settings,
                    icon: Settings,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-border">
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all mb-3 group shadow-lg"
                  >
                    <ShieldCheck size={16} /> Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/templates"
                  className="w-full flex items-center justify-center gap-3 p-4 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl transition-all mb-3 group"
                >
                  <Plus size={16} /> {t.dashboard.sidebar.initiate}
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-4 text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  <LogOut size={16} /> {t.dashboard.sidebar.disconnect}
                </button>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="space-y-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-card border border-border/50 group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                      <stat.icon size={18} />
                    </div>
                    <div className="text-2xl font-black text-foreground">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter mb-2">
                  {t.dashboard.title}
                </h1>
                <p className="text-muted-foreground font-medium text-lg">
                  {t.dashboard.welcome}, {user?.name}
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/templates"
                  className="px-8 py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl group"
                >
                  {t.dashboard.actions.gallery}{" "}
                  <ChevronRight
                    size={14}
                    className={`ml-1 inline ${lang === "ar" ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform`}
                  />
                </Link>
              </div>
            </header>

            {error && (
              <div
                className={`p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse" : ""}`}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Status Card */}
                  <div className="lg:col-span-2 p-10 rounded-[3rem] bg-foreground text-background relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 backdrop-blur-md">
                        <Zap size={14} className="text-primary" />{" "}
                        {t.dashboard.overview.statusReport}
                      </div>

                      <div className="space-y-12">
                        {/* Orders Section */}
                        <div>
                          <h3 className="text-3xl font-black tracking-tighter mb-4">
                            {t.dashboard.nav.orders}
                          </h3>
                          <div className="h-1 w-12 bg-primary mb-6" />
                          <div className="space-y-3">
                            {orders.length === 0 ? (
                              <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">
                                {t.dashboard.overview.noActive}
                              </p>
                            ) : (
                              orders.slice(0, 2).map((order) => (
                                <div
                                  key={order.id || order.id}
                                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                      <Package size={18} />
                                    </div>
                                    <div className="text-sm font-black uppercase tracking-widest opacity-80">
                                      {order.service_type || "N/A"}
                                    </div>
                                  </div>
                                  <div className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                    {order.status}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Recent Contact Requests Section */}
                        <div>
                          <h3 className="text-3xl font-black tracking-tighter mb-4">
                            {t.dashboard.overview.recentMails ||
                              "Contact Requests"}
                          </h3>
                          <div className="h-1 w-12 bg-primary mb-6" />
                          <div className="space-y-3">
                            {contacts.length === 0 ? (
                              <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">
                                No recent transmissions.
                              </p>
                            ) : (
                              contacts.slice(0, 2).map((c: any) => (
                                <div
                                  key={c.id}
                                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                      <Mail size={18} />
                                    </div>
                                    <div className="text-sm font-black uppercase tracking-widest opacity-80 line-clamp-1 max-w-[150px]">
                                      {c.subject}
                                    </div>
                                  </div>
                                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                    {c.created_at
                                      ? new Date(c.created_at).toLocaleDateString()
                                      : "---"}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-10 rounded-[3rem] bg-card border border-border/50">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-10">
                      {t.dashboard.actions.shortcuts}
                    </h4>
                    <div className="grid gap-4">
                      <Link
                        to="/templates"
                        className="flex items-center justify-between p-6 rounded-3xl bg-muted hover:bg-primary hover:text-primary-foreground group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Layout
                            size={20}
                            className="text-primary group-hover:text-primary-foreground"
                          />
                          <span className="text-sm font-black uppercase tracking-widest">
                            {t.dashboard.actions.discover}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center justify-between p-6 rounded-3xl bg-muted hover:bg-primary hover:text-primary-foreground group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Cpu
                            size={20}
                            className="text-primary group-hover:text-primary-foreground"
                          />
                          <span className="text-sm font-black uppercase tracking-widest">
                            {t.dashboard.actions.initialize}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                      <Link
                        to="/services"
                        className="flex items-center justify-between p-6 rounded-3xl bg-muted hover:bg-primary hover:text-primary-foreground group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Layers
                            size={20}
                            className="text-primary group-hover:text-primary-foreground"
                          />
                          <span className="text-sm font-black uppercase tracking-widest">
                            {t.dashboard.actions.scale}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-1">
                        {t.dashboard.orders.title}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {t.dashboard.orders.manage}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-3 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-border">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted text-left border-b border-border">
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.id}
                          </th>
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.architecture}
                          </th>
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.state}
                          </th>
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.timestamp}
                          </th>
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.capital}
                          </th>
                          <th
                            className={`p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest ${lang === "ar" ? "text-right" : ""}`}
                          >
                            {t.dashboard.orders.table.operations}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-medium">
                        {orders.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="p-16 text-center text-muted-foreground opacity-50 uppercase tracking-widest text-xs font-black"
                            >
                              No operational data found in current temporal
                              window.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr
                              key={order.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="p-6 text-xs font-black text-primary uppercase tracking-tighter">
                                {(order.id || "").slice(-8)}
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <FileCode size={16} />
                                  </div>
                                  <span className="text-sm text-foreground">
                                    {order.service_type || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-6">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    order.status === "completed"
                                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                                      : order.status === "processing" ||
                                          order.status === "inProgress" ||
                                          order.status === "in_progress"
                                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                        : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                  }`}
                                >
                                  {t.dashboard.orders.statuses[
                                    order.status as keyof typeof t.dashboard.orders.statuses
                                  ] || order.status}
                                </span>
                              </td>
                              <td className="p-6 text-xs text-muted-foreground">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString()
                                  : "---"}
                              </td>
                              <td className="p-6 text-sm font-black text-foreground">
                                ${order.amount}
                              </td>
                              <td className="p-6">
                                <div className="flex gap-2">
                                  <button className="px-4 py-2 bg-muted text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all transform hover:scale-105">
                                    {t.dashboard.orders.extract}
                                  </button>
                                  <button
                                    onClick={() =>
                                      navigate(`/order-detail/${order.id}`)
                                    }
                                    className="px-4 py-2 border border-border text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-primary transition-all"
                                  >
                                    {t.dashboard.orders.analyze}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm max-w-4xl">
                  <div className="mb-12">
                    <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-1">
                      {t.dashboard.nav.settings}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">
                      {t.dashboard.settings.configure}
                    </p>
                  </div>

                  <form
                    className="space-y-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert(t.dashboard.settings.success);
                    }}
                  >
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] pb-2 border-b border-border">
                        {t.dashboard.settings.profileParams}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-primary font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t.dashboard.settings.identity}
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="w-full bg-background border border-border p-4 text-sm rounded-xl focus:border-primary placeholder:opacity-30 transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-primary font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t.dashboard.settings.comms}
                          </label>
                          <input
                            type="email"
                            defaultValue={user?.email}
                            className="w-full bg-background border border-border p-4 text-sm rounded-xl focus:border-primary placeholder:opacity-30 transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-primary font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t.dashboard.settings.telecom}
                          </label>
                          <input
                            type="tel"
                            placeholder="+XX XXX XXX XXXX"
                            className="w-full bg-background border border-border p-4 text-sm rounded-xl focus:border-primary placeholder:opacity-30 transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-primary font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {t.dashboard.settings.corporate}
                          </label>
                          <input
                            type="text"
                            placeholder="Entity Name"
                            className="w-full bg-background border border-border p-4 text-sm rounded-xl focus:border-primary placeholder:opacity-30 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] pb-2 border-b border-border">
                        {t.dashboard.settings.sync}
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            id: "marketing",
                            title: t.dashboard.settings.strategic.title,
                            sub: t.dashboard.settings.strategic.sub,
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/10 transition-all"
                          >
                            <div>
                              <p className="text-sm font-black uppercase tracking-widest text-foreground">
                                {item.title}
                              </p>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">
                                {item.sub}
                              </p>
                            </div>
                            <button
                              type="button"
                              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${item.id === "marketing" ? "bg-primary shadow-glow-primary" : "bg-border"}`}
                            >
                              <div
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${item.id === "marketing" ? (lang === "ar" ? "right-1 translate-x-0" : "left-8") : lang === "ar" ? "right-8" : "left-1"}`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-12 py-5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-foreground transition-all shadow-xl shadow-primary/20"
                    >
                      Sync Updates
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
