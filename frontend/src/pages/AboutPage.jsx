import { useState, useEffect } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import CartDropdown from "../components/CartComponent";

function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getCartTotal } = useCart();

  const QuickActionButton = ({ title, icon, to, color }) => (
    <a href={to} className={color}>
      {icon} {title}
    </a>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.pages.getBySlug("about");
        setPageData(data);
      } catch (error) {
        console.error("Error fetching about page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { number: "15+", label: "Ani de Experiență", icon: "📅" },
    { number: "500+", label: "Produse în Catalog", icon: "📦" },
    { number: "10,000+", label: "Clienți Mulțumiți", icon: "👥" },
    { number: "50+", label: "Parteneri Internaționali", icon: "🤝" },
  ];

  const values = [
    {
      icon: "🌱",
      title: "Calitate",
      description:
        "Oferim doar produse certificate și testate, garantând cele mai bune rezultate pentru culturile tale. Fiecare lot este verificat înainte de livrare.",
    },
    {
      icon: "🤝",
      title: "Încredere",
      description:
        "Construim relații pe termen lung cu clienții noștri, bazate pe transparență, onestitate și servicii impecabile de peste 15 ani.",
    },
    {
      icon: "🚀",
      title: "Inovație",
      description:
        "Aducem cele mai noi tehnologii și soiuri din agricultura mondială, adaptate condițiilor climatice din Moldova pentru rezultate optime.",
    },
    {
      icon: "💚",
      title: "Sustenabilitate",
      description:
        "Promovăm practici agricole responsabile care protejează mediul înconjurător și asigură un viitor sănătos pentru generațiile viitoare.",
    },
  ];

  const timeline = [
    { year: "2008", title: "Fondarea companiei", description: "AO Semințe își deschide porțile în Chișinău, cu o gamă inițială de 50 de produse." },
    { year: "2012", title: "Primul parteneriat internațional", description: "Parteneriatul cu Syngenta ne permite accesul la soiuri premium europene." },
    { year: "2016", title: "Extinderea depozitului", description: "Inaugurăm noul depozit de 2000 mp, cel mai mare centru de distribuție agronomică din regiune." },
    { year: "2020", title: "10,000 clienți activi", description: "Atingem pragul de 10,000 de clienți care ne acordă încredere în fiecare sezon." },
    { year: "2024", title: "Lansarea platformei online", description: "Portalul digital permite comenzi rapide cu livrare în toată Moldova." },
  ];

  const team = [
    { name: "Alexandru Munteanu", role: "Director General", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
    { name: "Elena Cojocaru", role: "Agronom Principal", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
    { name: "Mihai Rotaru", role: "Director Comercial", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
    { name: "Ana Popescu", role: "Manager Logistică", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
  ];

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

      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=800&fit=crop)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Despre <span className="text-[#00C896]">AO Semințe</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-6">
              Partenerii tăi de încredere în agricultură din 2008. Calitate, inovație și dedicare pentru fermierul moldovenesc.
            </p>
            <div className="text-sm text-white/80">
              <a href="/" className="hover:text-[#00C896]">Acasă</a> / <span>Despre Noi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-[#1B5E20] mb-1">{stat.number}</div>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-[#00C896] font-bold text-sm uppercase tracking-wider">Cine suntem</span>
            <h2 className="text-4xl font-black mt-2 mb-6">
              Povestea <span className="text-[#00C896]">noastră</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Fondată în 2008, AO Semințe s-a născut din pasiunea pentru agricultura moldovenească și dorința de a oferi fermierilor access la cele mai bune produse agricole disponibile pe piața internațională.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              De-a lungul anilor, am crescut de la un mic magazin de semințe la cel mai mare distribuitor de produse agricole din regiune, servind peste 10,000 de clienți activi în toată Moldova.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Echipa noastră de agronomi cu experiență oferă consultanță gratuită, ajutându-te să alegi cele mai potrivite soluții pentru culturile tale.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="h-96 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop)`,
                }}
              ></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#00C896] text-white rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-black">15+</div>
              <div className="font-semibold">Ani de experiență</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="h-96 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop)`,
                }}
              ></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#00C896] font-bold text-sm uppercase tracking-wider">Misiunea noastră</span>
            <h2 className="text-4xl font-black mt-2 mb-6">
              Dedicați <span className="text-[#00C896]">succesului</span> tău
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Misiunea noastră este să oferim fermierilor din Moldova acces la cele mai calitative semințe, pesticide și fertilizanți, la prețuri accesibile, însoțite de consultanță profesionistă.
            </p>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                Produse certificate conform standardelor europene
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                Consultanță agronomică gratuită și personalizată
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                Livrare rapidă în toată Moldova
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                Prețuri competitive și rata de fidelitate
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Valorile <span className="text-[#00C896]">noastre</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Principiile care ne ghidează în fiecare zi și care ne fac parteneri de încredere
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-[#00C896]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Parcursul <span className="text-[#00C896]">nostru</span>
          </h2>
          <p className="text-gray-600 text-lg">Momente cheie din istoria AO Semințe</p>
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#00C896]/30 transform md:-translate-x-1/2"></div>
          {timeline.map((item, i) => (
            <div key={i} className={`relative flex items-center mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className={`flex-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-12 md:pl-0`}>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <span className="text-[#00C896] font-black text-2xl">{item.year}</span>
                  <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#00C896] rounded-full border-4 border-white shadow transform -translate-x-1/2 z-10"></div>
              <div className="flex-1 hidden md:block"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Echipa <span className="text-[#00C896]">noastră</span>
            </h2>
            <p className="text-gray-600 text-lg">Profesioniștii care fac totul posibil</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
                <div className="h-64 overflow-hidden">
                  <div
                    className="h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${member.image})` }}
                  ></div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-lg">{member.name}</h4>
                  <p className="text-[#00C896] font-semibold text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1B5E20] via-[#2d7a32] to-[#1B5E20] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#00C896] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Vrei să colaborezi cu noi?
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-xl opacity-90">
            Suntem mereu deschiși pentru parteneriate noi și gata să ajutăm fermierul moldovean să reușească.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold py-4 px-12 rounded-full shadow-xl transition transform hover:scale-105">
              Contactează-ne →
            </a>
            <a href="/products" className="bg-white text-[#1B5E20] hover:bg-gray-100 font-bold py-4 px-12 rounded-full shadow-xl transition transform hover:scale-105">
              Explorează catalogul
            </a>
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

export default AboutPage;
