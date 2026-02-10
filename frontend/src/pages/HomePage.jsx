import { useState, useEffect } from "react";
import api from "../services/api";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [partners, setPartners] = useState([]);
  const [config, setConfig] = useState(null);

  const QuickActionButton = ({ title, icon, to, color }) => {
    return (
      <a href={to} className={color}>
        {icon} {title}
      </a>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          productsData,
          categoriesData,
          newsData,
          partnersData,
          configData,
        ] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
          // api.news.getAll(),
          // api.partners.getAll(),
          api.config.get(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setNews(newsData.slice(0, 2));
        setPartners(partnersData);
        setConfig(configData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const heroSlides = [
    {
      title: "Semințe Profesionale",
      subtitle: "pentru Recolte Premium",
      description:
        "Calitate superioară pentru agricultori, fermieri și pasionați.",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=800&fit=crop",
      cta: "Vezi Catalogul",
    },
    {
      title: "Pesticide & Fertilizanți",
      subtitle: "Protecție Completă",
      description:
        "Soluții profesionale pentru culturi sănătoase și productive.",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=800&fit=crop",
      cta: "Explorează Gamă",
    },
    {
      title: "Consultanță Gratuită",
      subtitle: "de la Experți",
      description: "Echipa noastră te ajută să alegi cele mai bune soluții.",
      image:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=800&fit=crop",
      cta: "Contactează-ne",
    },
  ];

  const features = [
    {
      icon: "✓",
      title: "Calitate Garantată",
      text: "Produse certificate internațional și testate în condiții locale.",
    },
    {
      icon: "🚚",
      title: "Livrare Rapidă",
      text: "În orice zonă din Moldova. Livrare gratuită peste 500 MDL.",
    },
    {
      icon: "💼",
      title: "Suport Profesional",
      text: "Consiliere agronomică gratuită pentru culturile tale.",
    },
    {
      icon: "💳",
      title: "Plată Flexibilă",
      text: "Cash, card sau transfer bancar. Rate disponibile.",
    },
  ];

  const testimonials = [
    {
      name: "Ion Popescu",
      location: "Căușeni",
      text: "Calitate excelentă! Colaborez de 5 ani și am crescut producția cu 30%.",
      rating: 5,
    },
    {
      name: "Maria Cojocaru",
      location: "Orhei",
      text: "Prețuri corecte și echipă profesionistă. Recomand cu încredere!",
      rating: 5,
    },
    {
      name: "Vasile Rotaru",
      location: "Hâncești",
      text: "Livrare rapidă și produse originale. Cel mai bun furnizor!",
      rating: 5,
    },
  ];

  const featuredProducts = products.slice(0, 4);

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
    <div className="bg-gradient-to-b from-white to-[#F5F5F5] text-[#1B5E20]">
      <div className="bg-[#143d14] text-white py-2 text-sm">
        <div className="container mx-auto px-6 flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-4">
            <span>📞 {config?.phone || "+373 xx xxx xxx"}</span>
            <span className="hidden sm:inline">
              📧 {config?.email || "info@aoseminte.md"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              {config?.working_hours || "Lun–Vin: 8:00 – 18:00"}
            </span>
            <span>📍 {config?.address || "Chișinău, Moldova"}</span>
          </div>
        </div>
      </div>

      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="text-2xl md:text-3xl font-extrabold tracking-tight hover:opacity-90 transition flex items-center gap-2"
            >
              <img
                src="/src/assets/logo-ao-seminteno-bk.png"
                alt="Logo"
                className="w-25 h-16"
              />
              AO <span className="text-[#00C896]">Semințe</span>
            </a>

            <div className="hidden lg:flex space-x-8 font-semibold">
              <QuickActionButton
                title="Acasă"
                icon="🏠"
                to="/"
                color="white hover:text-[#00C896]"
              />
              <QuickActionButton
                title="Produse"
                icon="📦"
                to="/products"
                color="white hover:text-[#00C896]"
              />
              <QuickActionButton
                title="Noutăți"
                icon="📰"
                to="/news"
                color="white hover:text-[#00C896]"
              />
              <QuickActionButton
                title="Despre Noi"
                icon="ℹ️"
                to="/about"
                color="white hover:text-[#00C896]"
              />
              <QuickActionButton
                title="Contact"
                icon="📞"
                to="/contact"
                color="white hover:text-[#00C896]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:block hover:text-[#00C896] transition">
                🔍
              </button>
              <button className="hover:text-[#00C896] transition relative">
                🛒
                <span className="absolute -top-1 -right-1 bg-[#00C896] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartTotal()}
                </span>
              </button>
              <button className="hidden md:block hover:text-[#00C896] transition">
                👤
              </button>

              <button
                className="lg:hidden text-2xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4">
              {["Acasă", "Produse", "Noutăți", "Despre", "Contact"].map(
                (item, i) => (
                  <a
                    key={i}
                    href={
                      "/" +
                      item.toLowerCase().replace(/ă/g, "a").replace(/ț/g, "t")
                    }
                    className="block hover:text-[#00C896] transition"
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>
          )}
        </div>
      </header>

      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>

            <div className="relative h-full flex items-center justify-center text-center text-white px-6">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 animate-fadeIn">
                  {slide.title}
                  <br />
                  <span className="text-[#00C896]">{slide.subtitle}</span>
                </h1>

                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="/products"
                    className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold py-4 px-8 rounded-full shadow-xl transition transform hover:scale-105"
                  >
                    {slide.cta} →
                  </a>
                  <a
                    href="/contact"
                    className="bg-white/10 border-2 border-white/40 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-full font-semibold transition"
                  >
                    Consultanță Gratuită
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentSlide(
              (currentSlide - 1 + heroSlides.length) % heroSlides.length,
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full z-20 transition"
        >
          ←
        </button>
        <button
          onClick={() =>
            setCurrentSlide((currentSlide + 1) % heroSlides.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full z-20 transition"
        >
          →
        </button>
      </section>

      <div className="bg-white shadow-lg -mt-12 relative z-10 max-w-4xl mx-auto rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Caută semințe, pesticide, fertilizanți..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
          />
          <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]">
            <option>Toate categoriile</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold px-8 py-3 rounded-lg transition">
            Caută
          </button>
        </div>
      </div>

      <section className="py-12 container mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Categorii <span className="text-[#00C896]">populare</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descoperă gama noastră completă de produse agricole profesionale
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <a
              key={cat.id}
              href={`/products`}
              className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

              <div
                className="h-72 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: cat.image_url
                    ? `url(${cat.image_url})`
                    : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop)`,
                }}
              ></div>

              <div className="absolute bottom-0 p-6 text-white z-20 w-full">
                <div className="text-3xl mb-2">{cat.icon || "🌱"}</div>
                <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-200 mb-3">
                  {cat.description || "Produse de calitate"}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                  Explorează →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-[#f0f0f0]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Produse <span className="text-[#00C896]">populare</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Cele mai căutate produse de clienții noștri
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 group"
              >
                {product.is_new && (
                  <div className="absolute top-4 right-4 bg-[#00C896] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Nou
                  </div>
                )}

                <div className="relative h-56 bg-gradient-to-br from-[#4CAF50]/20 to-[#1B5E20]/20 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: product.image_url
                        ? `url(${product.image_url})`
                        : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop)`,
                    }}
                  >
                    <a href={`/produs/${product.id}`}>View Product</a>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                    <span className="text-gray-500 text-sm ml-1">(5.0)</span>
                  </div>

                  <p className="text-sm text-[#00C896] font-semibold mb-1">
                    {categories.find((c) => c.id === product.category_id)
                      ?.name || "General"}
                  </p>
                  <h4 className="text-xl font-bold mb-3 line-clamp-2">
                    {product.name}
                  </h4>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-[#1B5E20]">
                        {product.price} MDL
                      </span>
                      {product.old_price && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {product.old_price}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#00C896] hover:bg-[#00b584] text-white p-2 rounded-lg transition"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/produse"
              className="inline-block bg-[#1B5E20] hover:bg-[#174c1a] text-white px-10 py-4 rounded-full font-bold shadow-lg transition transform hover:scale-105"
            >
              Vezi toate produsele ({products.length}) →
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Ce spun <span className="text-[#00C896]">clienții</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Încrederea fermierilor este cea mai mare recompensă
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-600">📍 {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white overflow-hidden">
        <h2 className="text-center text-4xl font-black mb-10">
          Parteneri <span className="text-[#00C896]">oficiali</span>
        </h2>

        <div className="relative">
          <div className="flex gap-12 animate-scroll px-6">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 h-28 rounded-xl bg-white border-2 border-gray-200 hover:border-[#00C896] 
                     flex items-center justify-center shadow-lg hover:shadow-xl transition p-4"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-600 font-bold text-sm text-center">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6 bg-gradient-to-b from-[#f0f0f0] to-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Ultimele <span className="text-[#00C896]">noutăți</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Sfaturi utile și informații despre produsele noastre
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {news.map((newsItem) => (
            <a
              key={newsItem.id}
              href={`/noutate/${newsItem.id}`}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all group"
            >
              <div className="relative h-64 bg-gradient-to-br from-[#4CAF50]/25 to-[#1B5E20]/25 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: newsItem.image_url
                      ? `url(${newsItem.image_url})`
                      : `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop)`,
                  }}
                ></div>
                <div className="absolute top-4 left-4 bg-[#00C896] text-white px-3 py-1 rounded-full text-sm font-bold">
                  Noutăți
                </div>
              </div>

              <div className="p-8">
                <p className="text-sm text-gray-500 mb-2">
                  📅 {new Date(newsItem.created_at).toLocaleDateString("ro-RO")}
                </p>
                <h4 className="text-2xl font-bold mb-3 group-hover:text-[#00C896] transition">
                  {newsItem.title}
                </h4>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {newsItem.excerpt ||
                    newsItem.content?.substring(0, 150) + "..."}
                </p>
                <div className="text-[#00C896] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Citește mai mult →
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/noutati"
            className="inline-block bg-white text-[#1B5E20] border-2 border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white px-10 py-4 rounded-full font-bold shadow-lg transition"
          >
            Vezi toate noutățile →
          </a>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1B5E20] via-[#2d7a32] to-[#1B5E20] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#00C896] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Găsește produsele perfecte pentru afacerea ta
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-xl opacity-90">
            Calitate premium pentru orice cultură. Gamă completă în stoc.
            Consultanță gratuită de la experți.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold py-4 px-12 rounded-full shadow-xl transition transform hover:scale-105"
            >
              Explorează catalogul →
            </a>
            <a
              href="/contact"
              className="bg-white text-[#1B5E20] hover:bg-gray-100 font-bold py-4 px-12 rounded-full shadow-xl transition transform hover:scale-105"
            >
              Contactează-ne
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h3 className="text-3xl font-black mb-4">
            Abonează-te la <span className="text-[#00C896]">Newsletter</span>
          </h3>
          <p className="text-gray-600 mb-8">
            Primește oferte exclusive, sfaturi agricole și noutăți direct în
            inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email-ul tău"
              className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:border-[#00C896]"
            />
            <button className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold px-8 py-4 rounded-full transition">
              Abonează-te
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Respectăm confidențialitatea ta. Poți dezabona oricând.
          </p>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-[#1B5E20] to-[#143d14] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white text-[#1B5E20] w-10 h-10 rounded-full flex items-center justify-center text-xl">
                  🌱
                </span>
                <h3 className="text-2xl font-black">AO Semințe</h3>
              </div>
              <p className="text-gray-300 mb-6">
                {config?.description ||
                  "Semințe profesionale și soluții agricole pentru întreaga țară."}
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition"
                >
                  f
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition"
                >
                  in
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition"
                >
                  ✉
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00C896] text-lg">
                Linkuri Rapide
              </h4>
              <ul className="space-y-2">
                {[
                  "Produse",
                  "Noutăți",
                  "Despre noi",
                  "Contact",
                  "Livrare",
                  "Plată",
                ].map((l, i) => (
                  <li key={i}>
                    <a
                      className="text-gray-300 hover:text-[#00C896] transition"
                      href={
                        "/" +
                        l.toLowerCase().replace(/ă/g, "a").replace(/ț/g, "t")
                      }
                    >
                      → {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00C896] text-lg">
                Categorii Populare
              </h4>
              <ul className="space-y-2 text-gray-300">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>→ {cat.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00C896] text-lg">
                Contactează-ne
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>{config?.address || "Chișinău, Moldova"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a
                    href={`mailto:${config?.email}`}
                    className="hover:text-[#00C896]"
                  >
                    {config?.email || "info@aoseminte.md"}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a
                    href={`tel:${config?.phone}`}
                    className="hover:text-[#00C896]"
                  >
                    {config?.phone || "+373 xx xxx xxx"}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span>🕐</span>
                  <span>
                    {config?.working_hours || "Lun–Vin: 8:00 – 18:00"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 AO Semințe. Toate drepturile rezervate.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/termeni" className="hover:text-[#00C896]">
                Termeni și condiții
              </a>
              <a href="/confidentialitate" className="hover:text-[#00C896]">
                Confidențialitate
              </a>
              <a href="/cookies" className="hover:text-[#00C896]">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};


export default HomePage;