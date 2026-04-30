import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import CartDropdown from "../components/CartComponent";

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { getCartTotal } = useCart();
  const articlesPerPage = 9;

  const QuickActionButton = ({ title, icon, to, color }) => (
    <a href={to} className={color}>
      {icon} {title}
    </a>
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await api.news.getAll();
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const sampleNews = [
    {
      id: 1,
      title: "Ghid complet: Cum să alegi semințele potrivite pentru primăvară",
      summary: "Descoperă cele mai importante criterii de selecție a semințelor pentru un sezon agricol de succes. Sfaturi de la experții noștri agronomi.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      created_at: "2026-02-28T10:00:00",
      category: "Ghiduri",
    },
    {
      id: 2,
      title: "Noi soiuri de legume disponibile în catalogul nostru",
      summary: "Am adăugat peste 50 de soiuri noi de tomate, ardei și castraveți. Descoperă varietățile premium importate direct de la producători europeni.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop",
      created_at: "2026-02-20T14:30:00",
      category: "Produse Noi",
    },
    {
      id: 3,
      title: "10 sfaturi pentru protejarea culturilor împotriva înghețurilor târzii",
      summary: "Înghețurile târzii pot distruge culturile tinere. Iată cum îți poți proteja plantele folosind metode simple și eficiente.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
      created_at: "2026-02-15T09:00:00",
      category: "Sfaturi",
    },
    {
      id: 4,
      title: "Poveste de succes: Ferma Rotaru din Orhei",
      summary: "Vasile Rotaru ne povestește cum a crescut producția cu 40% folosind semințele și fertilizanții de la AO Semințe.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      created_at: "2026-02-10T11:00:00",
      category: "Știri",
    },
    {
      id: 5,
      title: "Fertilizarea solului: Ghid practic pentru începători",
      summary: "Tot ce trebuie să știi despre tipurile de fertilizanți, dozajul corect și momentul optim de aplicare pentru diferite culturi.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
      created_at: "2026-02-05T08:30:00",
      category: "Ghiduri",
    },
    {
      id: 6,
      title: "AO Semințe - Partener oficial Bayer CropScience în Moldova",
      summary: "Suntem mândri să anunțăm un nou parteneriat strategic cu Bayer CropScience, lider mondial în protecția culturilor.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop",
      created_at: "2026-01-28T16:00:00",
      category: "Știri",
    },
    {
      id: 7,
      title: "Irigarea eficientă: Economisește apă și crește producția",
      summary: "Sisteme moderne de irigare care te ajută să reduci consumul de apă cu 30% și să crești randamentul culturilor.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
      created_at: "2026-01-20T10:00:00",
      category: "Sfaturi",
    },
    {
      id: 8,
      title: "Calendarul agricol 2026: Ce și când să semeni",
      summary: "Planifică-ți sezonul agricol cu calendarul nostru detaliat. Perioade optime de semănat pentru cele mai populare culturi din Moldova.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1595351298020-038700609878?w=800&h=600&fit=crop",
      created_at: "2026-01-15T12:00:00",
      category: "Ghiduri",
    },
    {
      id: 9,
      title: "Reduceri de iarnă: Până la 30% la semințe și fertilizanți",
      summary: "Profită de ofertele speciale de sezon și aprovizionează-te pentru primăvară la prețuri avantajoase.",
      content: "",
      thumbnail: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=800&h=600&fit=crop",
      created_at: "2026-01-10T09:00:00",
      category: "Produse Noi",
    },
  ];

  const displayNews = news.length > 0 ? news : sampleNews;

  const categories = ["all", "Ghiduri", "Produse Noi", "Sfaturi", "Știri"];

  const filteredNews =
    selectedCategory === "all"
      ? displayNews
      : displayNews.filter((n) => n.category === selectedCategory);

  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const currentArticles = filteredNews.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const featuredArticle = filteredNews[0];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">
            Se încarcă noutățile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] text-[#1B5E20]">
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
            Noutăți și Sfaturi <span className="text-[#00C896]">Agricole</span>
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Informații utile, ghiduri practice și ultimele știri din lumea
            agriculturii moderne din Moldova
          </p>
          <div className="mt-6 text-sm opacity-80">
            <a href="/" className="hover:text-[#00C896]">
              Acasă
            </a>{" "}
            / <span>Noutăți</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#00C896] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {cat === "all" ? "Toate" : cat}
            </button>
          ))}
        </div>

        {featuredArticle && currentPage === 1 && selectedCategory === "all" && (
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden group">
            <div className="grid md:grid-cols-2">
              <div className="relative h-72 md:h-auto overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: featuredArticle.thumbnail
                      ? `url(${featuredArticle.thumbnail})`
                      : `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop)`,
                  }}
                ></div>
                <div className="absolute top-4 left-4 bg-[#00C896] text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                  ⭐ Recomandat
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {featuredArticle.category && (
                  <span className="text-sm text-[#00C896] font-semibold mb-2">
                    {featuredArticle.category}
                  </span>
                )}
                <h2 className="text-3xl font-black mb-4 group-hover:text-[#00C896] transition">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredArticle.summary || featuredArticle.content?.substring(0, 200) + "..."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    📅{" "}
                    {new Date(featuredArticle.created_at).toLocaleDateString(
                      "ro-RO",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  <Link
                    to={`/news/${featuredArticle.id}`}
                    className="text-[#00C896] font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Citește mai mult →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentArticles
            .slice(currentPage === 1 && selectedCategory === "all" ? 1 : 0)
            .map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: article.thumbnail
                        ? `url(${article.thumbnail})`
                        : `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop)`,
                    }}
                  ></div>
                  {article.category && (
                    <div className="absolute top-4 left-4 bg-[#00C896] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      {article.category}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-gray-500 mb-2">
                    📅{" "}
                    {new Date(article.created_at).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#00C896] transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {article.summary || article.content?.substring(0, 150) + "..."}
                  </p>
                  <Link
                    to={`/news/${article.id}`}
                    className="text-[#00C896] font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto"
                  >
                    Citește mai mult →
                  </Link>
                </div>
              </article>
            ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Nu sunt noutăți disponibile
            </h3>
            <p className="text-gray-600">
              Reveniți în curând pentru noutăți și sfaturi agricole
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#1B5E20] hover:bg-[#00C896] hover:text-white shadow"
              }`}
            >
              ← Anterior
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-[#00C896] text-white shadow-lg"
                      : "bg-white text-[#1B5E20] hover:bg-gray-100 shadow"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#1B5E20] hover:bg-[#00C896] hover:text-white shadow"
              }`}
            >
              Următor →
            </button>
          </div>
        )}
      </div>

      <section className="py-20 bg-gradient-to-r from-[#1B5E20] via-[#2d7a32] to-[#1B5E20] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#00C896] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-black mb-4">
            Abonează-te la Newsletter
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Primește sfaturi agricole și oferte exclusive direct în inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email-ul tău"
              className="flex-1 px-6 py-4 rounded-full border-1 border-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00C896]"
            />
            <button className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold px-8 py-4 rounded-full transition transform hover:scale-105">
              Abonează-te
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-[#1B5E20] to-[#143d14] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-white text-[#1B5E20] w-10 h-10 rounded-full flex items-center justify-center text-xl">
              🌱
            </span>
            <h3 className="text-2xl font-black">AO Semințe</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Semințe profesionale și soluții agricole pentru întreaga țară.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/" className="hover:text-[#00C896]">Acasă</a>
            <a href="/products" className="hover:text-[#00C896]">Produse</a>
            <a href="/news" className="hover:text-[#00C896]">Noutăți</a>
            <a href="/about" className="hover:text-[#00C896]">Despre Noi</a>
            <a href="/contact" className="hover:text-[#00C896]">Contact</a>
          </div>
          <p className="text-gray-400 text-sm mt-8">
            © 2024 AO Semințe. Toate drepturile rezervate.
          </p>
        </div>
      </footer>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default NewsPage;
