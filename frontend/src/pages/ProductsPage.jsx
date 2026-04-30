import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDropdown from "../components/CartComponent";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getCartTotal } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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
        const [productsData, categoriesData] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);

        if (productsData.length > 0) {
          const prices = productsData.map((p) => parseFloat(p.price));
          setPriceRange({
            min: 0,
            max: Math.ceil(Math.max(...prices) / 100) * 100,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const getFilteredProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id === parseInt(selectedCategory),
      );
    }

    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_desc":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return products.length;
    return products.filter((p) => p.category_id === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">
            Se încarcă produsele...
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
              <QuickActionButton
                title="Acasă"
                icon="🏠"
                to="/"
                color="text-white hover:text-[#00C896] transition"
              />
              <QuickActionButton
                title="Produse"
                icon="📦"
                to="/products"
                color="text-white hover:text-[#00C896] transition"
              />
              <QuickActionButton
                title="Noutăți"
                icon="📰"
                to="/news"
                color="text-white hover:text-[#00C896] transition"
              />
              <QuickActionButton
                title="Despre Noi"
                icon="ℹ️"
                to="/about"
                color="text-white hover:text-[#00C896] transition"
              />
              <QuickActionButton
                title="Contact"
                icon="📞"
                to="/contact"
                color="text-white hover:text-[#00C896] transition"
              />
            </nav>

            <div className="flex items-center gap-4">
              <CartDropdown />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Catalogul nostru de <span className="text-[#00C896]">produse</span>
          </h1>
          <p className="text-lg opacity-90">
            Descoperă gama completă de semințe, pesticide și fertilizanți
          </p>
          <div className="mt-6 text-sm opacity-80">
            <a href="/" className="hover:text-[#00C896]">
              Acasă
            </a>{" "}
            / <span>Produse</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Filtre</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-[#00C896] font-semibold"
                >
                  {showFilters ? "Ascunde" : "Arată"}
                </button>
              </div>

              <div
                className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                <div>
                  <label className="block font-bold mb-3 text-gray-700">
                    🔍 Caută produse
                  </label>
                  <input
                    type="text"
                    placeholder="Nume produs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] transition"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-3 text-gray-700">
                    Categorie
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={selectedCategory === "all"}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-[#00C896]"
                        />
                        <span>Toate produsele</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({getCategoryCount("all")})
                      </span>
                    </label>

                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="category"
                            value={cat.id}
                            checked={selectedCategory === cat.id.toString()}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className="w-4 h-4 text-[#00C896]"
                          />
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({getCategoryCount(cat.id)})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-3 text-gray-700">
                    💰 Preț
                  </label>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">
                          Min (MDL)
                        </label>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">
                          Max (MDL)
                        </label>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] mt-1"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={
                        products.length > 0
                          ? Math.max(
                              ...products.map((p) => parseFloat(p.price)),
                            )
                          : 10000
                      }
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-3 text-gray-700">
                    ⬆️ Sortare
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896] transition"
                  >
                    <option value="default">Implicit</option>
                    <option value="price_asc">Preț: Crescător</option>
                    <option value="price_desc">Preț: Descrescător</option>
                    <option value="name_asc">Nume: A-Z</option>
                    <option value="name_desc">Nume: Z-A</option>
                    <option value="newest">Cele mai noi</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange({ min: 0, max: 10000 });
                    setSortBy("default");
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition"
                >
                  Resetează filtrele
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "produs" : "produse"} găsite
                </h3>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Căutare pentru: "
                    <span className="font-semibold">{searchQuery}</span>"
                  </p>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="lg:hidden px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00C896]"
              >
                <option value="default">Sortare</option>
                <option value="price_asc">Preț ↑</option>
                <option value="price_desc">Preț ↓</option>
                <option value="name_asc">Nume A-Z</option>
                <option value="name_desc">Nume Z-A</option>
                <option value="newest">Noi</option>
              </select>
            </div>

            {currentProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 group flex flex-col"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="block cursor-pointer"
                    >
                      <div className="relative">
                        {product.is_new && (
                          <div className="absolute top-4 right-4 bg-[#00C896] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                            Nou
                          </div>
                        )}
                        {product.old_price && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                            -
                            {Math.round(
                              (1 - product.price / product.old_price) * 100,
                            )}
                            %
                          </div>
                        )}

                        <div className="h-56 bg-gradient-to-br from-[#4CAF50]/20 to-[#1B5E20]/20 overflow-hidden relative">
                          <div
                            className="h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                            style={{
                              backgroundImage: product.image_url
                                ? `url(${product.image_url})`
                                : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop)`,
                            }}
                          />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="bg-white text-[#1B5E20] px-4 py-2 rounded-lg font-semibold shadow">
                              Vezi produs
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <p className="text-sm text-[#00C896] font-semibold mb-1">
                          {categories.find((c) => c.id === product.category_id)
                            ?.name || "General"}
                        </p>

                        <h4 className="text-lg font-bold mb-2 line-clamp-2 flex-1">
                          {product.name}
                        </h4>

                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {product.stock !== undefined && (
                          <div className="mb-3">
                            {product.stock > 0 ? (
                              <span className="text-xs text-green-600 font-semibold">
                                ✓ În stoc ({product.stock} buc)
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 font-semibold">
                                ✗ Stoc epuizat
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">
                              ⭐
                            </span>
                          ))}
                          <span className="text-gray-500 text-xs ml-1">
                            (5.0)
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex justify-between items-center mt-auto p-5 pt-3 border-t">
                      <div>
                        <span className="text-2xl font-bold text-[#1B5E20]">
                          {product.price} MDL
                        </span>
                        {product.old_price && (
                          <span className="block text-sm text-gray-400 line-through">
                            {product.old_price} MDL
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={product.stock === 0}
                        className={`${
                          product.stock === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#00C896] hover:bg-[#00b584]"
                        } text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2`}
                      >
                        🛒 Adaugă
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Nu am găsit produse
                </h3>
                <p className="text-gray-600 mb-6">
                  Încercați să modificați filtrele sau căutarea
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange({ min: 0, max: 10000 });
                    setSortBy("default");
                  }}
                  className="bg-[#00C896] hover:bg-[#00b584] text-white px-8 py-3 rounded-full font-bold transition"
                >
                  Resetează filtrele
                </button>
              </div>
            )}

            {totalPages > 1 && currentProducts.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition ${
                            currentPage === page
                              ? "bg-[#00C896] text-white shadow-lg"
                              : "bg-white text-[#1B5E20] hover:bg-gray-100 shadow"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
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
          </main>
        </div>
      </div>

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
            <a href="/" className="hover:text-[#00C896]">
              Acasă
            </a>
            <a href="/products" className="hover:text-[#00C896]">
              Produse
            </a>
            <a href="/contact" className="hover:text-[#00C896]">
              Contact
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-8">
            © 2024 AO Semințe. Toate drepturile rezervate.
          </p>
        </div>
      </footer>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;
