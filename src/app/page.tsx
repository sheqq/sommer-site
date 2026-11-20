import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDiscordAccessToken,
  getOwnedDiscordGuildIds,
} from "@/lib/discord";
import { listServers } from "@/lib/servers";
import { ColorsSwitch } from "@/app/components/colors-switch";
import { DiscordAuthButton } from "@/app/components/discord-auth-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [serverResult, session] = await Promise.all([
    listServers()
      .then((servers) => ({ ok: true as const, servers }))
      .catch((error: unknown) => ({ ok: false as const, error })),
    getServerSession(authOptions),
  ]);
  const servers = serverResult.ok ? serverResult.servers : [];
  const serversLoadFailed = !serverResult.ok;
  if (!serverResult.ok) {
    console.error("Failed to load servers:", serverResult.error);
  }

  let ownedGuildIds = new Set<string>();
  let ownershipLookupFailed = false;

  if (session) {
    const accessToken = await getDiscordAccessToken();
    if (accessToken) {
      try {
        ownedGuildIds = await getOwnedDiscordGuildIds(accessToken);
      } catch (error) {
        console.error("Failed to load Discord server ownership:", error);
        ownershipLookupFailed = true;
      }
    } else {
      ownershipLookupFailed = true;
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Sommer Bot Startseite">
          <span className="wordmark-icon" aria-hidden="true">
            s
          </span>
          sommer<span className="wordmark-muted">-bot</span>
        </Link>
        <DiscordAuthButton
          signedIn={Boolean(session)}
          reconnect={Boolean(session && ownershipLookupFailed)}
        />
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
            <h2>Alle Server auf einen Blick.</h2>
          </div>
        </div>

        {!session && (
          <p className="server-access-note">
            Melde dich mit Discord an. Nur Serverinhaber können Farbrollen
            aktivieren oder deaktivieren.
          </p>
        )}
        {session && ownershipLookupFailed && (
          <p className="server-access-error" role="alert">
            Deine Discord-Server konnten nicht geprüft werden. Verbinde Discord
            erneut, um Einstellungen zu ändern.
          </p>
        )}

        {serversLoadFailed ? (
          <p className="server-access-error" role="alert">
            Die Serverliste konnte nicht geladen werden. Bitte prüfe die
            Verbindung zur Bot-Datenbank und versuche es später erneut.
          </p>
        ) : servers.length === 0 ? (
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
                {session && ownedGuildIds.has(server.guildId) ? (
                  <ColorsSwitch
                    guildId={server.guildId}
                    enabled={server.colorsEnabled === true}
                  />
                ) : (
                  <span
                    className={`server-colors ${
                      server.colorsEnabled ? "enabled" : "disabled"
                    }`}
                  >
                    Farben {server.colorsEnabled ? "aktiviert" : "deaktiviert"}
                  </span>
                )}
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
