import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import CartDropdown from "../components/CartComponent";


const sampleNews = [
  {
    id: 1,
    title: "Ghid complet: Cum să alegi semințele potrivite pentru primăvară",
    summary: "Descoperă cele mai importante criterii de selecție a semințelor pentru un sezon agricol de succes.",
    content: "Alegerea semințelor potrivite este primul și cel mai important pas pentru o recoltă bogată. În acest sezon, specialiștii noștri recomandă să acorzi o atenție deosebită caracteristicilor climatice din zona ta și calității solului. \n\n1. Verifică certificarea semințelor: Asigură-te că achiziționezi semințe certificate, cu un grad mare de germinare.\n\n2. Cunoaște-ți solul: Efectuează o analiză a solului pentru a înțelege ce nutrienți lipsesc. Pentru solurile argiloase sau nisipoase, alege soiuri rezistente la fluctuații de umiditate.\n\n3. Tratamente preventive: Tratarea semințelor înainte de semănat te poate salva de atacul dăunătorilor și bolilor din stadiile timpurii. \n\nInvestiția în semințe de calitate îți garantează o diferență vizibilă la recoltare. Vino la AO Semințe pentru consultanță gratuită!",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop",
    created_at: "2026-02-28T10:00:00",
    category: "Ghiduri",
  },
  {
    id: 2,
    title: "Noi soiuri de legume disponibile în catalogul nostru",
    summary: "Am adăugat peste 50 de soiuri noi de tomate, ardei și castraveți.",
    content: "Dragi fermieri și grădinari, avem vești excelente! Catalogul AO Semințe s-a îmbogățit cu peste 50 de varietăți noi de legume, importate direct de la producători europeni de top.\n\nPrintre atracțiile sezonului se numără soiuri de tomate super-timpurii, rezistente la mană, și hibrizi de castraveți cornichon ideali pentru murat sau consum proaspăt. Pentru producătorii de ardei, am adus soiuri cu pulpa groasă, foarte productive și rezistente la transport.\n\nToate aceste produse pot fi comandate online sau le găsiți direct în magazinul nostru.",
    thumbnail: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=1200&h=600&fit=crop",
    created_at: "2026-02-20T14:30:00",
    category: "Produse Noi",
  },
  {
    id: 3,
    title: "10 sfaturi pentru protejarea culturilor împotriva înghețurilor târzii",
    summary: "Înghețurile târzii pot distruge culturile tinere. Metode simple și eficiente.",
    content: "Temperaturile scăzute din lunile aprilie sau chiar mai pot reprezenta un pericol imens pentru culturile proaspăt răsărite.\n\n1. Foliază termică: Aplicarea unei folii anti-îngheț (agril) menține o temperatură cu câteva grade mai ridicată la nivelul solului.\n2. Irigarea: Un sol umed reține mai bine căldura și o eliberează treptat noaptea.\n3. Fumigația: Pentru suprafețe mici, fumul blochează pierderea căldurii radiante din sol.\n\nUrmărește prognoza meteo zilnic și pregătește fermele din timp pentru a nu fi luat prin surprindere.",
    thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop",
    created_at: "2026-02-15T09:00:00",
    category: "Sfaturi",
  },
  {
    id: 4,
    title: "Poveste de succes: Ferma Rotaru din Orhei",
    summary: "Vasile Rotaru ne povestește cum a crescut producția cu 40% folosind produsele noastre.",
    content: "Domnul Vasile Rotaru din Orhei ne-a povestit recent despre parcursul său agricol și saltul uriaș de producție pe care l-a înregistrat sezonul trecut.\n\n„Am avut mereu probleme cu bolile de sol și randamentul scăzut. Anul trecut am decis să colaborez exclusiv cu agronomii de la AO Semințe. Am implementat programul lor de nutriție și am folosit hibrizii recomandați de ei. Rezultatul? Producția medie la hectar a crescut cu aproape 40%, iar calitatea legumelor a atras cumpărători din prima zi de piață.”\n\nSuntem mândri să facem parte din poveștile voastre de succes!",
    thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop",
    created_at: "2026-02-10T11:00:00",
    category: "Știri",
  },
  {
    id: 5,
    title: "Fertilizarea solului: Ghid practic pentru începători",
    summary: "Tot ce trebuie să știi despre tipurile de fertilizanți și momentul aplicării.",
    content: "Solul este viața de sub picioarele noastre. Pentru a oferi plantelor nutrienții de care au nevoie, o fertilizare corectă este absolut necesară.\n\nFertilizanții de bază (azot, fosfor, potasiu - NPK) trebuie încorporați în sol fie toamna, fie primăvara devreme. Azotul ajută creșterea masei vegetative, fosforul dezvoltă rădăcinile, iar potasiul oferă rezistență și îmbunătățește calitatea fructelor.\n\nDeși îngrășămintele chimice sunt eficiente, recomandăm și încorporarea de materie organică (compost, gunoi de grajd maturat) pentru a menține structura poroasă a solului și activitatea microbiologică.",
    thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=600&fit=crop",
    created_at: "2026-02-05T08:30:00",
    category: "Ghiduri",
  },
];


function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCartTotal } = useCart();

  const QuickActionButton = ({ title, icon, to, color }) => (
    <Link to={to} className={color}>
      {icon} {title}
    </Link>
  );

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await api.news.getById(id);
        setArticle(data);
      } catch (err) {
        console.warn("Nu am găsit articolul în API, caut în fallback...", err.message);
        const fallbackArticle = sampleNews.find((n) => n.id === parseInt(id));
        if (fallbackArticle) {
          setArticle(fallbackArticle);
        } else {
          setError("Articolul nu a fost găsit.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B5E20] font-semibold">Se încarcă articolul...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-6xl mb-4">📰</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{error || "Eroare necunoscută"}</h2>
        <Link to="/news" className="text-white bg-[#00C896] hover:bg-[#00b584] px-6 py-3 rounded-full font-bold transition">
          Înapoi la Noutăți
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] text-[#1B5E20]">

      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-extrabold tracking-tight hover:opacity-90 transition flex items-center gap-2"
            >
              <img
                src="/src/assets/logo-ao-seminteno-bk.png"
                alt="Logo"
                className="w-25 h-16"
              />
              AO <span className="text-[#00C896]">Semințe</span>
            </Link>

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

      <section className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-sm opacity-80 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-[#00C896]">Acasă</Link> 
            <span>/</span>
            <Link to="/news" className="hover:text-[#00C896]">Noutăți</Link> 
            <span>/</span>
            <span className="truncate">{article.title}</span>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span className="bg-[#00C896] px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {article.category}
              </span>
            )}
            <span className="text-sm font-medium opacity-90">
              📅 {new Date(article.created_at).toLocaleDateString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 transform -translate-y-16">
          {article.thumbnail && (
            <div className="w-full h-64 md:h-96">
              <img 
                src={article.thumbnail} 
                alt={article.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop";
                }}
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <p className="text-xl md:text-2xl text-gray-600 font-semibold mb-8 italic border-l-4 border-[#00C896] pl-6">
              {article.summary}
            </p>
            
            <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-line">
              {article.content || "Conținutul detaliat va fi adăugat în curând..."}
            </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link to="/news" className="text-[#1B5E20] font-bold flex items-center gap-2 hover:text-[#00C896] transition">
              ← Înapoi la noutăți
            </Link>
            
            <div className="flex gap-3">
              <button className="bg-white px-4 py-2 rounded-lg font-bold shadow hover:shadow-md transition text-blue-600">
                Partajează pe Facebook
              </button>
            </div>
          </div>
        </article>
      </main>

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
            <Link to="/" className="hover:text-[#00C896]">Acasă</Link>
            <Link to="/products" className="hover:text-[#00C896]">Produse</Link>
            <Link to="/news" className="hover:text-[#00C896]">Noutăți</Link>
            <Link to="/about" className="hover:text-[#00C896]">Despre Noi</Link>
            <Link to="/contact" className="hover:text-[#00C896]">Contact</Link>
          </div>
          <p className="text-gray-400 text-sm mt-8">
            © 2024 AO Semințe. Toate drepturile rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ArticlePage;
