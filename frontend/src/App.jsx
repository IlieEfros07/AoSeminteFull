import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>

      <section>
        <div>
          <h1>Semințe Profesionale de Calitate</h1>
          <p>
            Produse premium pentru legume, flori și cultura agricolă modernă.
          </p>
          <a href="/produse">Vezi Catalogul</a>
        </div>
      </section>

      <section>
        <h2>Categorii populare</h2>

        <div>
          {[
            { title: "Semințe legume" },
            { title: "Semințe flori" },
            { title: "Pesticide / Îngrășăminte" },
          ].map((c, index) => (
            <a key={index} href="/produse">
              <div></div>
              <div>
                <h3>{c.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2>Produse populare</h2>

        <div>
          {[1, 2, 3, 4].map((p) => (
            <div key={p}>
              <div></div>
              <div>
                <h4>Numele Produsului {p}</h4>
                <p>Descriere scurtă despre produs.</p>
                <div>
                  <span>89 MDL</span>
                  <a href={`/produs/${p}`}>Vezi detalii</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div>
          <h2>De ce AO Semințe?</h2>
          <p>
            Suntem o companie locală specializată în distribuția de semințe
            profesionale, pesticide și îngrășăminte pentru agricultori, fermieri
            și pasionați. Oferim produse testate, sigure și eficiente pentru a
            garanta succesul culturilor tale.
          </p>
        </div>
      </section>

      <section>
        <h2>Ultimele noutăți</h2>

        <div>
          {[1, 2].map((n) => (
            <a key={n} href={`/noutate/${n}`}>
              <div></div>
              <div>
                <h4>Titlu noutate {n}</h4>
                <p>Scurtă descriere / sumar al articolului.</p>
                <span>Citește mai mult</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2>Găsește produsele perfecte pentru cultura ta!</h2>
        <p>
          Descoperă gama completă și beneficiază de calitatea superioară AO
          Semințe.
        </p>
        <a href="/produse">Vezi produsele</a>
      </section>
    </div>
  );
}

export default App
