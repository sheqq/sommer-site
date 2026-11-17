import Link from "next/link";

const endpoints = [
  { method: "GET", path: "/api/v1/users", description: "Alle Nutzer abrufen" },
  { method: "POST", path: "/api/v1/users", description: "Nutzer anlegen" },
  { method: "GET", path: "/api/v1/users/{userId}", description: "Nutzer abrufen" },
  { method: "PUT", path: "/api/v1/users/{userId}", description: "Nutzer ersetzen" },
  { method: "DELETE", path: "/api/v1/users/{userId}", description: "Nutzer löschen" },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Sommer API Startseite">
          <span className="wordmark-icon" aria-hidden="true">
            s
          </span>
          sommer<span className="wordmark-muted">/api</span>
        </Link>
        <span className="status">
          <span className="status-dot" />
          API-Grundgerüst
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">SOMMER.DE · REST API</p>
        <h1>
          Ein guter Anfang
          <br />
          für <span>neue Ideen.</span>
        </h1>
        <p className="hero-copy">
          Das Fundament für die sommer.de API ist bereit. Nutzer werden über
          eine geschützte REST-Schnittstelle verwaltet und in MongoDB gespeichert.
        </p>
        <a className="primary-link" href="#endpoints">
          API-Endpunkte entdecken <span aria-hidden="true">↓</span>
        </a>
        <div className="hero-decoration" aria-hidden="true">
          <span className="sun" />
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
        </div>
      </section>

      <section className="api-section" id="endpoints">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ÜBERSICHT</p>
            <h2>Deine API, auf einen Blick.</h2>
          </div>
          <a className="spec-link" href="/sommer-facade.yaml">
            OpenAPI-Spezifikation <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="endpoint-list">
          {endpoints.map((endpoint) => (
            <div className="endpoint-row" key={`${endpoint.method}-${endpoint.path}`}>
              <span className={`method method-${endpoint.method.toLowerCase()}`}>
                {endpoint.method}
              </span>
              <code>{endpoint.path}</code>
              <span className="endpoint-description">{endpoint.description}</span>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>sommer-bot.vercel.de</span>
        <span>by sheqq</span>
      </footer>
    </main>
  );
}
