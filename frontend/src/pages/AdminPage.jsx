import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [news, setNews] = useState([]);
  const [partners, setPartners] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  useEffect(() => {
    if (
      !localStorage.getItem("admin_logged_in") ||
      localStorage.getItem("admin_role") !== "admin"
    ) {
      navigate("/admin/login");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prod, cats, ord, n, part, conf] = await Promise.all([
        api.products.getAll().catch(() => []),
        api.categories.getAll().catch(() => []),
        api.orders.getAll().catch(() => []),
        api.news.getAll().catch(() => []),
        api.partners.getAll().catch(() => []),
        api.config.get().catch(() => null),
      ]);
      setProducts(prod);
      setCategories(cats);
      setOrders(ord);
      setNews(n);
      setPartners(part);
      setConfig(conf);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_user_id");
    navigate("/admin/login");
  };

  const openCreate = (type) => {
    setModalType(type);
    setEditItem(null);
    setFormData(getDefaults(type));
    setShowModal(true);
  };

  const openEdit = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({});
  };

  const getDefaults = (type) => {
    switch (type) {
      case "product": return { name: "", slug: "", description: "", price: 0, stock: 0, category_id: "", is_active: true, image_url: "" };
      case "category": return { name: "", slug: "" };
      case "news": return { title: "", slug: "", summary: "", content: "", thumbnail: "" };
      case "partner": return { name: "", logo_url: "", link: "", sort_order: 0 };
      default: return {};
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (modalType === "product") {
        const data = { ...formData, price: parseFloat(formData.price) || 0, stock: parseInt(formData.stock) || 0, category_id: parseInt(formData.category_id) || null };
        if (editItem) await api.products.update(editItem.id, data);
        else await api.products.create(data);
        setProducts(await api.products.getAll().catch(() => []));
      } else if (modalType === "category") {
        if (editItem) await api.categories.update(editItem.id, formData);
        else await api.categories.create(formData);
        setCategories(await api.categories.getAll().catch(() => []));
      } else if (modalType === "news") {
        if (editItem) await api.news.update(editItem.id, formData);
        else await api.news.create(formData);
        setNews(await api.news.getAll().catch(() => []));
      } else if (modalType === "partner") {
        const data = { ...formData, sort_order: parseInt(formData.sort_order) || 0 };
        if (editItem) await api.partners.update(editItem.id, data);
        else await api.partners.create(data);
        setPartners(await api.partners.getAll().catch(() => []));
      }
      closeModal();
    } catch (e) {
      alert("Eroare: " + (e.message || "Ceva nu a mers bine"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm("Sigur vrei să ștergi acest element?")) return;
    try {
      if (type === "product") { await api.products.delete(id); setProducts(await api.products.getAll().catch(() => [])); }
      if (type === "category") { await api.categories.delete(id); setCategories(await api.categories.getAll().catch(() => [])); }
      if (type === "news") { await api.news.delete(id); setNews(await api.news.getAll().catch(() => [])); }
      if (type === "partner") { await api.partners.delete(id); setPartners(await api.partners.getAll().catch(() => [])); }
    } catch (e) {
      alert("Eroare la ștergere: " + e.message);
    }
  };

  const updateOrderStatus = async (orderId, field, value) => {
    try {
      await api.orders.update(orderId, { [field]: value });
      setOrders(await api.orders.getAll().catch(() => []));
    } catch (e) {
      alert("Eroare: " + e.message);
    }
  };

  const handleConfigSave = async () => {
    try {
      setSaving(true);
      await api.config.update(config);
      alert("Setările au fost salvate!");
    } catch (e) {
      alert("Eroare: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
  const newOrders = orders.filter((o) => o.order_status === "new").length;

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = orderFilter === "all"
    ? orders
    : orders.filter((o) => o.order_status === orderFilter);

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "products", icon: "📦", label: "Produse" },
    { id: "categories", icon: "📁", label: "Categorii" },
    { id: "orders", icon: "🛒", label: "Comenzi" },
    { id: "news", icon: "📰", label: "Noutăți" },
    { id: "partners", icon: "🤝", label: "Parteneri" },
    { id: "settings", icon: "⚙️", label: "Setări" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Se încarcă panoul admin...</p>
        </div>
      </div>
    );
  }

  const StatusBadge = ({ status, type = "order" }) => {
    const colors = {
      new: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      pending: "bg-orange-100 text-orange-700",
      paid: "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-[#1B5E20] text-white transition-all duration-300 flex flex-col fixed h-full z-40`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            {sidebarOpen && <span className="font-black text-lg">AO Admin</span>}
          </div>
        </div>

        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                activeTab === tab.id
                  ? "bg-[#00C896] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg flex-shrink-0">{tab.icon}</span>
              {sidebarOpen && <span className="font-semibold">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full text-left text-white/60 hover:text-white text-sm px-2">
            {sidebarOpen ? "◁ Ascunde" : "▷"}
          </button>
          <a href="/" className="block text-white/60 hover:text-white text-sm px-2">🌐 Vezi site</a>
          <button onClick={logout} className="w-full text-left text-red-300 hover:text-red-100 text-sm px-2">
            🚪 Deconectare
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}>
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-2xl font-black text-gray-800">
            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="text-sm text-gray-500">
            Admin #{localStorage.getItem("admin_user_id")}
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Produse", value: products.length, icon: "📦", color: "bg-blue-50 text-blue-700" },
                  { label: "Comenzi", value: orders.length, icon: "🛒", color: "bg-green-50 text-green-700" },
                  { label: "Comenzi noi", value: newOrders, icon: "🆕", color: "bg-orange-50 text-orange-700" },
                  { label: "Venituri totale", value: `${totalRevenue.toFixed(2)} MDL`, icon: "💰", color: "bg-purple-50 text-purple-700" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.color} rounded-2xl p-6 shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="text-sm font-semibold opacity-70">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4">Ultimele comenzi</h3>
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-semibold">#{o.id} — {o.customer_name}</p>
                        <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString("ro-RO")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{parseFloat(o.total).toFixed(2)} MDL</p>
                        <StatusBadge status={o.order_status} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4">Rezumat rapid</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-gray-600">Categorii</span><span className="font-bold">{categories.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Noutăți publicate</span><span className="font-bold">{news.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Parteneri</span><span className="font-bold">{partners.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Produse active</span><span className="font-bold">{products.filter(p => p.is_active).length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Stoc total (buc)</span><span className="font-bold">{products.reduce((s, p) => s + (p.stock || 0), 0)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Caută produse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] w-full sm:w-80"
                />
                <button onClick={() => openCreate("product")} className="bg-[#00C896] hover:bg-[#00b584] text-white px-6 py-2 rounded-lg font-bold transition flex-shrink-0">
                  + Adaugă produs
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">ID</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Nume</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Categorie</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Preț</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Stoc</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Activ</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{p.id}</td>
                          <td className="px-4 py-3 font-semibold">{p.name}</td>
                          <td className="px-4 py-3 text-sm">{categories.find(c => c.id === p.category_id)?.name || "—"}</td>
                          <td className="px-4 py-3 font-bold text-[#1B5E20]">{p.price} MDL</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">{p.is_active ? "✅" : "❌"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit("product", p)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">✏️ Edit</button>
                              <button onClick={() => handleDelete("product", p.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-gray-500">Niciun produs găsit</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              <div className="flex justify-end mb-6">
                <button onClick={() => openCreate("category")} className="bg-[#00C896] hover:bg-[#00b584] text-white px-6 py-2 rounded-lg font-bold transition">
                  + Adaugă categorie
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">ID</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Nume</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Slug</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Produse</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{c.id}</td>
                        <td className="px-4 py-3 font-semibold">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{c.slug}</td>
                        <td className="px-4 py-3 text-sm">{products.filter(p => p.category_id === c.id).length}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit("category", c)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">✏️ Edit</button>
                            <button onClick={() => handleDelete("category", c.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && <div className="p-8 text-center text-gray-500">Nicio categorie</div>}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                {["all", "new", "processing", "shipped", "delivered", "cancelled"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                      orderFilter === f ? "bg-[#00C896] text-white" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                  >
                    {f === "all" ? `Toate (${orders.length})` : `${f} (${orders.filter(o => o.order_status === f).length})`}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">#</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Client</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Telefon</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Adresă</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Total</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Plată</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-bold">{o.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold">{o.customer_name}</p>
                            <p className="text-xs text-gray-500">{o.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 text-sm">{o.customer_phone}</td>
                          <td className="px-4 py-3 text-sm max-w-[200px] truncate">{o.customer_address}</td>
                          <td className="px-4 py-3 font-bold text-[#1B5E20]">{parseFloat(o.total).toFixed(2)} MDL</td>
                          <td className="px-4 py-3">
                            <select
                              value={o.order_status}
                              onChange={(e) => updateOrderStatus(o.id, "order_status", e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#00C896]"
                            >
                              <option value="new">new</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={o.payment_status}
                              onChange={(e) => updateOrderStatus(o.id, "payment_status", e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#00C896]"
                            >
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="refunded">refunded</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(o.created_at).toLocaleDateString("ro-RO")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && <div className="p-8 text-center text-gray-500">Nicio comandă</div>}
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div>
              <div className="flex justify-end mb-6">
                <button onClick={() => openCreate("news")} className="bg-[#00C896] hover:bg-[#00b584] text-white px-6 py-2 rounded-lg font-bold transition">
                  + Adaugă articol
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">ID</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Titlu</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Rezumat</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Data</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {news.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{n.id}</td>
                        <td className="px-4 py-3 font-semibold max-w-[300px] truncate">{n.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[300px] truncate">{n.summary}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleDateString("ro-RO") : "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit("news", n)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">✏️ Edit</button>
                            <button onClick={() => handleDelete("news", n.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {news.length === 0 && <div className="p-8 text-center text-gray-500">Nicio noutate</div>}
              </div>
            </div>
          )}

          {activeTab === "partners" && (
            <div>
              <div className="flex justify-end mb-6">
                <button onClick={() => openCreate("partner")} className="bg-[#00C896] hover:bg-[#00b584] text-white px-6 py-2 rounded-lg font-bold transition">
                  + Adaugă partener
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="h-16 object-contain mb-4" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">🤝</div>
                    )}
                    <h4 className="font-bold mb-1">{p.name}</h4>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-sm text-[#00C896] hover:underline mb-3">{p.link}</a>}
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => openEdit("partner", p)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">✏️</button>
                      <button onClick={() => handleDelete("partner", p.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">🗑️</button>
                    </div>
                  </div>
                ))}
                {partners.length === 0 && <div className="col-span-full p-8 text-center text-gray-500">Niciun partener</div>}
              </div>
            </div>
          )}

          {activeTab === "settings" && config && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6">Setări site</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📞 Telefon</label>
                    <input
                      type="text" value={config.phone || ""} onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
                    <input
                      type="email" value={config.email || ""} onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Adresă</label>
                    <input
                      type="text" value={config.address || ""} onChange={(e) => setConfig({ ...config, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🕐 Program de lucru</label>
                    <input
                      type="text" value={config.working_hours || ""} onChange={(e) => setConfig({ ...config, working_hours: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
                    />
                  </div>
                  <button
                    onClick={handleConfigSave} disabled={saving}
                    className={`w-full py-3 rounded-lg font-bold transition ${saving ? "bg-gray-300 cursor-not-allowed" : "bg-[#00C896] hover:bg-[#00b584] text-white"}`}
                  >
                    {saving ? "Se salvează..." : "Salvează setările"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editItem ? "Editează" : "Adaugă"} {modalType === "product" ? "produs" : modalType === "category" ? "categorie" : modalType === "news" ? "articol" : "partener"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {modalType === "product" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nume *</label>
                    <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Slug *</label>
                    <input type="text" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Preț (MDL) *</label>
                      <input type="number" step="0.01" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Stoc</label>
                      <input type="number" value={formData.stock || ""} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Categorie</label>
                    <select value={formData.category_id || ""} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]">
                      <option value="">Fără categorie</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Descriere</label>
                    <textarea rows="3" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">URL Imagine</label>
                    <input type="text" value={formData.image_url || ""} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.is_active ?? true} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-semibold">Produs activ</span>
                  </label>
                </>
              )}

              {modalType === "category" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nume *</label>
                    <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Slug *</label>
                    <input type="text" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                </>
              )}

              {modalType === "news" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Titlu *</label>
                    <input type="text" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Slug *</label>
                    <input type="text" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Rezumat</label>
                    <textarea rows="2" value={formData.summary || ""} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Conținut</label>
                    <textarea rows="6" value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">URL Thumbnail</label>
                    <input type="text" value={formData.thumbnail || ""} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                </>
              )}

              {modalType === "partner" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nume *</label>
                    <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">URL Logo</label>
                    <input type="text" value={formData.logo_url || ""} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Link</label>
                    <input type="text" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ordine sortare</label>
                    <input type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]" />
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition">
                Anulează
              </button>
              <button
                onClick={handleSave} disabled={saving}
                className={`flex-1 py-2 rounded-lg font-bold transition ${saving ? "bg-gray-300 cursor-not-allowed" : "bg-[#00C896] hover:bg-[#00b584] text-white"}`}
              >
                {saving ? "Se salvează..." : editItem ? "Salvează" : "Creează"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
