import { useState, useEffect } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import CartDropdown from "../components/CartComponent";

function ContactPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getCartTotal } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const QuickActionButton = ({ title, icon, to, color }) => (
    <a href={to} className={color}>
      {icon} {title}
    </a>
  );

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await api.config.get();
        setConfig(configData);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Numele este obligatoriu";
    if (!formData.email.trim()) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefonul este obligatoriu";
    } else if (!/^[0-9+\s()-]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Număr de telefon invalid";
    }
    if (formData.message.length < 20) {
      newErrors.message = "Mesajul trebuie să aibă minim 20 caractere";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const businessHours = [
    { day: "Luni", hours: "8:00 – 18:00", open: true },
    { day: "Marți", hours: "8:00 – 18:00", open: true },
    { day: "Miercuri", hours: "8:00 – 18:00", open: true },
    { day: "Joi", hours: "8:00 – 18:00", open: true },
    { day: "Vineri", hours: "8:00 – 18:00", open: true },
    { day: "Sâmbătă", hours: "9:00 – 14:00", open: true },
    { day: "Duminică", hours: "Închis", open: false },
  ];

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const faq = [
    {
      q: "Cum pot plasa o comandă?",
      a: "Poți comanda online prin site-ul nostru, telefonic, sau vizitând showroom-ul nostru din Chișinău. Comenzile online sunt procesate în maxim 24 de ore.",
    },
    {
      q: "Care sunt costurile de livrare?",
      a: "Livrarea este gratuită pentru comenzi peste 500 MDL. Sub această sumă, costul livrării este de 50 MDL, oriunde în Moldova.",
    },
    {
      q: "Puteți returna produsele?",
      a: "Da, acceptăm returnări în termen de 14 zile de la primirea coletului, cu condiția ca produsele să fie în ambalajul original.",
    },
    {
      q: "Oferiți consultanță agronomică?",
      a: "Da, echipa noastră de agronomi oferă consultanță gratuită. Ne puteți contacta telefonic sau prin email pentru sfaturi personalizate.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] text-[#1B5E20]">
      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight hover:opacity-90 transition flex items-center gap-2">
              <img src="/src/assets/logo-ao-seminteno-bk.png" alt="Logo" className="w-25 h-16" />
              AO <span className="text-[#00C896]">Semințe</span>
            </a>
            <nav className="hidden lg:flex space-x-8 font-semibold">
              <QuickActionButton title="Acasă" icon="🏠" to="/" color="text-white hover:text-[#00C896] transition" />
              <QuickActionButton title="Produse" icon="📦" to="/products" color="text-white hover:text-[#00C896] transition" />
              <QuickActionButton title="Noutăți" icon="📰" to="/news" color="text-white hover:text-[#00C896] transition" />
              <QuickActionButton title="Despre Noi" icon="ℹ️" to="/about" color="text-white hover:text-[#00C896] transition" />
              <QuickActionButton title="Contact" icon="📞" to="/contact" color="text-white hover:text-[#00C896] transition" />
            </nav>
            <div className="flex items-center gap-4">
              <CartDropdown />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Contactează<span className="text-[#00C896]">-ne</span>
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Suntem aici să te ajutăm. Contactează-ne prin orice metodă
            convenabilă pentru tine.
          </p>
          <div className="mt-6 text-sm opacity-80">
            <a href="/" className="hover:text-[#00C896]">Acasă</a> / <span>Contact</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#00C896]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Telefon</h3>
              <p className="text-gray-600 mb-1">{config?.phone || "+373 XX XXX XXX"}</p>
              <p className="text-gray-500 text-sm mb-4">{config?.working_hours || "Lun–Vin: 8:00 – 18:00"}</p>
              <a
                href={`tel:${config?.phone || "+373000000"}`}
                className="text-[#00C896] font-semibold hover:underline"
              >
                Sună-ne →
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#00C896]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600 mb-1">{config?.email || "info@aoseminte.md"}</p>
              <p className="text-gray-500 text-sm mb-4">Răspundem în maxim 24h</p>
              <a
                href={`mailto:${config?.email || "info@aoseminte.md"}`}
                className="text-[#00C896] font-semibold hover:underline"
              >
                Trimite Email →
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#00C896]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Locație</h3>
              <p className="text-gray-600 mb-1">{config?.address || "Chișinău, Moldova"}</p>
              <p className="text-gray-500 text-sm mb-4">Vizitează showroom-ul nostru</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(config?.address || "Chișinău, Moldova")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00C896] font-semibold hover:underline"
              >
                Obține Direcții →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-black mb-2">Trimite-ne un mesaj</h2>
              <p className="text-gray-600 mb-8">Completează formularul și te vom contacta în cel mai scurt timp.</p>

              {submitStatus === "success" && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold">Mesajul a fost trimis cu succes! Te vom contacta în curând.</span>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-semibold">A apărut o eroare. Vă rugăm încercați din nou.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nume complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] transition ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Ion Popescu"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] transition ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="email@exemplu.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] transition ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="+373 XX XXX XXX"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subiect
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] transition"
                    >
                      <option value="">Selectează subiectul</option>
                      <option value="general">Întrebări generale</option>
                      <option value="comenzi">Comenzi</option>
                      <option value="suport">Suport tehnic</option>
                      <option value="colaborare">Colaborare</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mesaj <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00C896] transition resize-none ${
                      errors.message ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Descrie-ne ce te interesează... (minim 20 caractere)"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                    submitStatus === "loading"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#00C896] hover:bg-[#00b584] text-white transform hover:scale-[1.02]"
                  }`}
                >
                  {submitStatus === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Se trimite...
                    </span>
                  ) : (
                    "Trimite Mesaj →"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🕐 Program de lucru
              </h3>
              <div className="space-y-2">
                {businessHours.map((item, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-lg transition ${
                      i === todayIndex
                        ? "bg-[#00C896]/10 border border-[#00C896]/30"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`font-semibold ${i === todayIndex ? "text-[#00C896]" : ""}`}>
                      {item.day}
                      {i === todayIndex && (
                        <span className="ml-2 text-xs bg-[#00C896] text-white px-2 py-0.5 rounded-full">
                          Astăzi
                        </span>
                      )}
                    </span>
                    <span className={item.open ? "text-gray-600" : "text-red-500 font-semibold"}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2d7a32] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Contact rapid</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${config?.phone || "+373000000"}`}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">{config?.phone || "+373 XX XXX XXX"}</p>
                    <p className="text-sm opacity-80">Sună acum</p>
                  </div>
                </a>
                <a
                  href={`mailto:${config?.email || "info@aoseminte.md"}`}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold">{config?.email || "info@aoseminte.md"}</p>
                    <p className="text-sm opacity-80">Trimite email</p>
                  </div>
                </a>
              </div>
              <p className="text-sm opacity-70 mt-4">
                Limbile: Română, Rusă
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-3xl font-black mb-6 text-center">
            Unde ne <span className="text-[#00C896]">găsești</span>
          </h2>
        </div>
        <div className="w-full h-[450px] bg-gray-200 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d87288.37837746723!2d28.77246!3d47.01045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b6d1b9%3A0x2d9fb39d239f29bf!2zQ2hpyJlpbsSDdSwgTW9sZG92YQ!5e0!3m2!1sen!2s!4v1709913600000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Locația AO Semințe pe harta"
          ></iframe>
          <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-bold">AO Semințe</p>
                <p className="text-sm text-gray-600">{config?.address || "Chișinău, Moldova"}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(config?.address || "Chișinău, Moldova")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00C896] text-sm font-semibold mt-1 inline-block"
                >
                  Deschide în Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Întrebări <span className="text-[#00C896]">frecvente</span>
            </h2>
            <p className="text-gray-600 text-lg">Răspunsuri rapide la cele mai comune întrebări</p>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-lg pr-4">{item.q}</span>
                  <span className={`text-2xl text-[#00C896] transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Mai ai întrebări?{" "}
              <a href={`tel:${config?.phone || "+373000000"}`} className="text-[#00C896] font-bold hover:underline">
                Sună-ne direct →
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-[#1B5E20] to-[#143d14] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-white text-[#1B5E20] w-10 h-10 rounded-full flex items-center justify-center text-xl">🌱</span>
            <h3 className="text-2xl font-black">AO Semințe</h3>
          </div>
          <p className="text-gray-300 mb-6">Semințe profesionale și soluții agricole pentru întreaga țară.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/" className="hover:text-[#00C896]">Acasă</a>
            <a href="/products" className="hover:text-[#00C896]">Produse</a>
            <a href="/news" className="hover:text-[#00C896]">Noutăți</a>
            <a href="/about" className="hover:text-[#00C896]">Despre Noi</a>
            <a href="/contact" className="hover:text-[#00C896]">Contact</a>
          </div>
          <p className="text-gray-400 text-sm mt-8">© 2024 AO Semințe. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
