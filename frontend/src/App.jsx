import { useState } from "react";

function App() {
  return (
    <div className="bg-gradient-to-b from-white to-[#F5F5F5] text-[#1B5E20]">
      <header className="bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <a
            href="/"
            className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition"
          >
            AO <span className="text-[#00C896]">Semințe</span>
          </a>

          <nav className="space-x-8 font-semibold">
            {["Acasă", "Produse", "Noutăți", "Despre", "Contact"].map(
              (item, i) => (
                <a
                  key={i}
                  href={"/" + item.toLowerCase().replace("ă", "a")}
                  className="hover:text-[#00C896] transition"
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>
      </header>

      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Semințe Profesionale
            <br />
            <span className="text-[#00C896]">pentru Recolte Premium</span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Calitate superioară pentru agricultori, fermieri și pasionați.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/produse"
              className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
            >
              Vezi Catalogul →
            </a>
            <a
              href="/despre-noi"
              className="bg-white/10 border border-white/30 backdrop-blur-sm hover:bg-white/20 px-8 py-3 rounded-full font-semibold transition"
            >
              Despre noi
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-black mb-10 text-center">
          Categorii <span className="text-[#00C896]">populare</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Semințe legume",
              img: "/images/cat-legume.jpg",
              icon: "🥕",
            },
            {
              title: "Semințe flori",
              img: "/images/cat-flori.jpg",
              icon: "🌸",
            },
            {
              title: "Pesticide / Îngrășăminte",
              img: "/images/cat-pest.jpg",
              icon: "🌾",
            },
          ].map((c, i) => (
            <a
              key={i}
              href="/produse"
              className="group block relative rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="absolute inset-0 bg-black/40 z-10"></div>

              <div
                className="h-60 bg-cover bg-center transition group-hover:scale-110"
                style={{ backgroundImage: `url(${c.img})` }}
              ></div>

              <div className="absolute bottom-0 p-6 text-white z-20">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="text-2xl font-bold">{c.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-[#f0f0f0]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-12">
            Produse <span className="text-[#00C896]">populare</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((p) => (
              <div
                key={p}
                className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden transition"
              >
                <div className="h-48 bg-gradient-to-br from-[#4CAF50]/20 to-[#1B5E20]/20"></div>

                <div className="p-6 text-left">
                  <h4 className="text-xl font-bold mb-2">
                    Numele Produsului {p}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Descriere scurtă despre avantajele produsului.
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">89 MDL</span>
                    <a
                      href={"/produs/" + p}
                      className="text-[#00C896] font-semibold hover:underline"
                    >
                      Detalii →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/produse"
            className="inline-block mt-10 bg-[#1B5E20] hover:bg-[#174c1a] text-white px-8 py-4 rounded-full font-bold shadow-lg transition"
          >
            Vezi toate produsele →
          </a>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <h2 className="text-center text-4xl font-black mb-12">
          De ce <span className="text-[#00C896]">AO Semințe</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: "✓",
              title: "Calitate Garantată",
              text: "Produse certificate și testate.",
            },
            {
              icon: "🚚",
              title: "Livrare Rapidă",
              text: "În orice zonă din Republica Moldova.",
            },
            {
              icon: "💼",
              title: "Suport Profesional",
              text: "Consiliere pentru culturile tale.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-2xl p-10 text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <h2 className="text-center text-4xl font-black mb-10">
          Parteneri <span className="text-[#00C896]">oficiali</span>
        </h2>

        <div className="overflow-hidden relative">
          <div className="flex gap-16 animate-scroll px-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 h-24 rounded-xl bg-[#1B5E20] opacity-80 hover:opacity-100
                     flex items-center justify-center shadow-md transition"
              >
                <span className="text-white font-bold text-xl opacity-70">
                  LOGO
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <h2 className="text-center text-4xl font-black mb-12">
          Ultimele <span className="text-[#00C896]">noutăți</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {[1, 2].map((n) => (
            <a
              key={n}
              href={"/noutate/" + n}
              className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden transition"
            >
              <div className="h-60 bg-gradient-to-br from-[#4CAF50]/25 to-[#1B5E20]/25"></div>

              <div className="p-8">
                <h4 className="text-2xl font-bold mb-4">Titlu noutate {n}</h4>
                <p className="text-gray-600 mb-4">
                  Scurt rezumat interesant al articolului.
                </p>
                <div className="text-[#00C896] font-bold">Citește →</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1B5E20] to-[#2d7a32] text-white text-center">
        <h2 className="text-4xl font-black mb-6">Găsește produsele perfecte</h2>
        <p className="max-w-xl mx-auto mb-10 opacity-90">
          Calitate premium pentru orice cultură. Gamă completă în stoc.
        </p>
        <a
          href="/produse"
          className="bg-[#00C896] hover:bg-[#00b584] text-white font-bold py-4 px-12 rounded-full shadow-lg transition"
        >
          Vezi produsele →
        </a>
      </section>


      <footer className="bg-[#1B5E20] text-white py-14 text-sm">
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-black mb-4">AO Semințe</h3>
            <p className="text-gray-300">
              Semințe profesionale și soluții agricole pentru întreaga țară.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-[#00C896]">Linkuri</h4>
            <ul className="space-y-2">
              {["Produse", "Noutăți", "Despre noi", "Contact"].map((l, i) => (
                <li key={i}>
                  <a
                    className="hover:text-[#00C896]"
                    href={"/" + l.toLowerCase().replace("ă", "a")}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-[#00C896]">Categorii</h4>
            <ul className="space-y-2">
              <li>Semințe legume</li>
              <li>Semințe flori</li>
              <li>Pesticide</li>
              <li>Îngrășăminte</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-[#00C896]">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Chișinău, Republica Moldova</li>
              <li>info@aoseminte.md</li>
              <li>+373 xx xxx xxx</li>
              <li>Lun–Vin: 8:00 – 18:00</li>
            </ul>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}


export default App;