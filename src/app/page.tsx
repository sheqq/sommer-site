import Link from "next/link";
import Image from "next/image";
import { listServers } from "@/lib/servers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const servers = await listServers();

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Sommer Bot Startseite">
          <span className="wordmark-icon" aria-hidden="true">
            s
          </span>
          sommer<span className="wordmark-muted">-bot</span>
        </Link>
        <span className="status">
          <span className="status-dot" />
          Discord-Bot
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">SOMMER · DISCORD BOT</p>
        <h1>
          Mehr Leben für
          <br />
          deinen <span>Server.</span>
        </h1>
        <p className="hero-copy">
          Sommer begleitet den Fortschritt deiner Community mit Leveln und
          farbigen Rollen.
        </p>
        <a className="primary-link" href="#features">
          Funktionen entdecken <span aria-hidden="true">↓</span>
        </a>
        <div className="hero-decoration" aria-hidden="true">
          <span className="sun" />
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
        </div>
      </section>

      <section className="content-section" id="features">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FUNKTIONEN</p>
            <h2>Was Sommer für deinen Server kann.</h2>
          </div>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <h3>Level &amp; XP</h3>
            <p>
              XP und Levelstände werden pro Mitglied und Server verwaltet. Der
              Bot liefert die Werte passend zu seinem Level-System.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-number">02</span>
            <h3>Farbige Rollen</h3>
            <p>
              Farbrollen werden nur erstellt, wenn sie für den jeweiligen
              Server aktiviert sind.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section" id="servers">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SERVER</p>
            <h2>Alle Communitys auf einem Blick.</h2>
          </div>
        </div>

        {servers.length === 0 ? (
          <p className="empty-state">Noch keine Server gespeichert.</p>
        ) : (
          <ul className="server-list">
            {servers.map((server) => (
              <li className="server-row" key={server.guildId}>
                <div className="server-identity">
                  {server.iconUrl ? (
                    <Image
                      className="server-avatar"
                      src={server.iconUrl}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                    />
                  ) : (
                    <span className="server-avatar server-avatar-fallback" aria-hidden="true">
                      {(server.name || server.guildId).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="server-details">
                    <span className="server-name">
                      {server.name || server.guildId}
                    </span>
                    <code>{server.guildId}</code>
                  </div>
                </div>
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
        <span>sommer-bot.vercel.app</span>
        <span>by sheqq</span>
      </footer>
    </main>
  );
}
