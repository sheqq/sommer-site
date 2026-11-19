import Link from "next/link";
import { listServers } from "@/lib/servers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const servers = await listServers();

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
          Level werden über eine geschützte REST-Schnittstelle verwaltet und in
          MongoDB gespeichert.
        </p>
        <a className="primary-link" href="#servers">
          Server anzeigen <span aria-hidden="true">↓</span>
        </a>
        <div className="hero-decoration" aria-hidden="true">
          <span className="sun" />
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
        </div>
      </section>

      <section className="api-section" id="servers">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ÜBERSICHT</p>
            <h2>Gespeicherte Server</h2>
          </div>
        </div>

        {servers.length === 0 ? (
          <p className="empty-state">Noch keine Server gespeichert.</p>
        ) : (
          <ul className="server-list">
            {servers.map((server) => (
              <li className="server-row" key={server.guildId}>
                <code>{server.guildId}</code>
                <span
                  className={`server-colors ${
                    server.colorsEnabled ? "enabled" : "disabled"
                  }`}
                >
                  Farben {server.colorsEnabled ? "aktiviert" : "deaktiviert"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <span>sommer-bot.vercel.de</span>
        <span>by sheqq</span>
      </footer>
    </main>
  );
}
