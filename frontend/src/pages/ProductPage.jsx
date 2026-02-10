import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const QuickActionButton = ({ title, icon, to, color }) => {
    return (
      <a href={to} className={color}>
        {icon} {title}
      </a>
    );
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await api.products.getById(id);
        setProduct(productData);

        if (productData.category_id) {
          const categoryData = await api.categories.getById(
            productData.category_id,
          );
          setCategory(categoryData);

          const allProducts = await api.products.getAll();
          const related = allProducts
            .filter(
              (p) =>
                p.category_id === productData.category_id &&
                p.id !== productData.id,
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Nu am putut încărca produsul. Vă rugăm încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const productImages = product?.images || [
    product?.image_url ||
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=800&fit=crop",
  ];

  const discountPercent = product?.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  const reviews = [
    {
      id: 1,
      author: "Ion Popescu",
      rating: 5,
      date: "15 Ian 2024",
      comment:
        "Semințe de calitate excelentă! Rata de germinare a fost peste 95%. Recomand cu încredere!",
      verified: true,
    },
    {
      id: 2,
      author: "Maria Cojocaru",
      rating: 5,
      date: "10 Ian 2024",
      comment:
        "Am cultivat aceste semințe anul trecut și am avut o recoltă extraordinară. Calitate premium!",
      verified: true,
    },
    {
      id: 3,
      author: "Vasile Rotaru",
      rating: 4,
      date: "5 Ian 2024",
      comment:
        "Produsul este bun, singura mențiune este că livrarea a întârziat puțin. Altfel, foarte mulțumit!",
      verified: false,
    },
  ];

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">Se încarcă produsul...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Produsul nu a fost găsit
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Produsul pe care îl căutați nu există sau a fost șters."}
          </p>
          <button
            onClick={() => navigate("/produse")}
            className="bg-[#00C896] hover:bg-[#00b584] text-white px-8 py-3 rounded-full font-bold transition"
          >
            ← Înapoi la produse
          </button>
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
              <button className="hover:text-[#00C896] transition relative">
                🛒
                <span className="absolute -top-1 -right-1 bg-[#00C896] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartTotal()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showNotification && (
        <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-slideIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">Adăugat în coș!</p>
              <p className="text-sm opacity-90">
                {quantity} x {product.name}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-600 hover:text-[#00C896]">
              Acasă
            </a>
            <span className="text-gray-400">/</span>
            <a href="/produse" className="text-gray-600 hover:text-[#00C896]">
              Produse
            </a>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <a
                  href={`/produse?category=${category.id}`}
                  className="text-gray-600 hover:text-[#00C896]"
                >
                  {category.name}
                </a>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-[#1B5E20] font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                    -{discountPercent}%
                  </div>
                )}
                {product.is_new && (
                  <div className="absolute top-4 right-4 bg-[#00C896] text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                    Nou
                  </div>
                )}
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${productImages[selectedImage]})`,
                  }}
                ></div>
              </div>

              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx
                          ? "border-[#00C896] ring-2 ring-[#00C896]/30"
                          : "border-gray-200 hover:border-[#00C896]/50"
                      }`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      ></div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {category && (
                <a
                  href={`/produse?category=${category.id}`}
                  className="inline-block text-sm text-[#00C896] font-semibold hover:underline"
                >
                  {category.name}
                </a>
              )}

              <h1 className="text-4xl font-black text-gray-800 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} recenzii)
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-[#1B5E20]">
                    {product.price} MDL
                  </span>
                  {product.old_price && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.old_price} MDL
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Economisești {product.old_price - product.price} MDL (
                    {discountPercent}%)
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {product.stock > 0 ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-600 font-semibold">
                      În stoc ({product.stock} bucăți disponibile)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-semibold">
                      Stoc epuizat
                    </span>
                  </>
                )}
              </div>

              {product.short_description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.short_description}
                </p>
              )}

              <div className="bg-green-50 rounded-xl p-6 space-y-3">
                <h3 className="font-bold text-lg mb-3">
                  ✓ Caracteristici principale:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      Semințe certificate conform standardelor internaționale
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Rată de germinare garantată peste 90%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Livrare gratuită pentru comenzi peste 500 MDL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Consultanță agronomică gratuită</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-bold">Cantitate:</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center py-2 focus:outline-none"
                    min="1"
                    max={product.stock || 999}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || 999, quantity + 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 ${
                    product.stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#00C896] hover:bg-[#00b584]"
                  } text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg`}
                >
                  <span className="text-xl">🛒</span>
                  Adaugă în coș
                </button>
                <button className="px-6 py-4 border-2 border-[#00C896] text-[#00C896] rounded-xl font-bold hover:bg-[#00C896] hover:text-white transition">
                  ❤️
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="font-semibold text-sm">Livrare rapidă</p>
                    <p className="text-xs text-gray-600">2-3 zile lucrătoare</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">↩️</span>
                  <div>
                    <p className="font-semibold text-sm">Retur ușor</p>
                    <p className="text-xs text-gray-600">14 zile garanție</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-sm">Plată securizată</p>
                    <p className="text-xs text-gray-600">Card sau cash</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold text-sm">Suport client</p>
                    <p className="text-xs text-gray-600">Lun-Vin 8:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            {[
              { id: "description", label: "Descriere", icon: "📝" },
              { id: "specifications", label: "Specificații", icon: "📋" },
              {
                id: "reviews",
                label: `Recenzii (${reviews.length})`,
                icon: "⭐",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#00C896] text-[#00C896]"
                    : "text-gray-600 hover:text-[#00C896]"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold mb-4">Descriere detaliată</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description ||
                    product.long_description ||
                    `${product.name} este un produs de calitate superioară, certificat și testat în condiții locale. Oferim garanție de 90% rată de germinare și suport complet pentru cultivare.`}
                </p>

                <h4 className="text-xl font-bold mt-6 mb-3">Avantaje:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Soi certificat de înaltă calitate</li>
                  <li>Rezistent la boli și condiții meteorologice adverse</li>
                  <li>Adaptat pentru condițiile climatice din Moldova</li>
                  <li>Producție ridicată și constantă</li>
                  <li>Suport tehnic gratuit de la agronomi</li>
                </ul>

                <h4 className="text-xl font-bold mt-6 mb-3">
                  Recomandări de cultivare:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Perioadă de semănat: Martie - Mai</li>
                  <li>Adâncime de semănat: 2-3 cm</li>
                  <li>Distanța între plante: 30-40 cm</li>
                  <li>Sol recomandat: Fertil, bine drenat</li>
                  <li>Recoltare: După 90-120 zile</li>
                </ul>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Specificații tehnice
                </h3>
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { label: "Cod produs", value: `SKU-${product.id}` },
                      {
                        label: "Categorie",
                        value: category?.name || "General",
                      },
                      {
                        label: "Producător",
                        value: product.manufacturer || "AO Semințe",
                      },
                      {
                        label: "Țara de origine",
                        value: product.origin || "Moldova",
                      },
                      { label: "Greutate", value: product.weight || "100g" },
                      {
                        label: "Durată de valabilitate",
                        value: product.shelf_life || "2 ani",
                      },
                      {
                        label: "Condiții de depozitare",
                        value: "Loc uscat și răcoros",
                      },
                      { label: "Rată de germinare", value: "> 90%" },
                    ].map((spec, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-4 font-semibold text-gray-700 w-1/3">
                          {spec.label}
                        </td>
                        <td className="py-4 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">Recenzii clienți</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-lg font-semibold">
                        {averageRating.toFixed(1)} din 5
                      </span>
                      <span className="text-gray-600">
                        ({reviews.length} recenzii)
                      </span>
                    </div>
                  </div>
                  <button className="bg-[#00C896] hover:bg-[#00b584] text-white px-6 py-3 rounded-lg font-semibold transition">
                    Scrie o recenzie
                  </button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">
                              {review.author}
                            </span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                                ✓ Cumpărător verificat
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black mb-8">
              Produse <span className="text-[#00C896]">similare</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/produs/${relatedProduct.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all group"
                >
                  <div className="h-56 bg-gradient-to-br from-[#4CAF50]/20 to-[#1B5E20]/20 overflow-hidden">
                    <div
                      className="h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: relatedProduct.image_url
                          ? `url(${relatedProduct.image_url})`
                          : `url(https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop)`,
                      }}
                    ></div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#1B5E20]">
                        {relatedProduct.price} MDL
                      </span>
                      <span className="text-[#00C896] font-semibold">
                        Vezi →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <a href="/produse" className="hover:text-[#00C896]">
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
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProductPage;
