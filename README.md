# Sommer Bot

Sommer unterstützt Discord-Communitys bei Levelständen und farbigen Rollen.
Eine Übersicht der Funktionen steht in [`docs/bot.md`](docs/bot.md). Dieses
Repository enthält die Webanwendung und die Schnittstelle zum Bot; die
Discord-Aktionen laufen im Bot selbst.

## Starten

Voraussetzung: Node.js 20.9 oder neuer und eine erreichbare MongoDB-Instanz.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

In `.env.local` `MONGODB_URI` (einschließlich Datenbankname im URI-Pfad),
`API_KEY`, `NEXTAUTH_SECRET`, `DISCORD_CLIENT_ID`,
`DISCORD_CLIENT_SECRET`, `BOT_WEBHOOK_URL` und `BOT_WEBHOOK_SECRET` setzen.
`NEXTAUTH_URL` muss auf die Web-App zeigen. Als Discord-OAuth-Redirect-URL
registrieren:
`<NEXTAUTH_URL>/api/auth/callback/discord`.

Der Bot muss unter `BOT_WEBHOOK_URL` einen HTTPS-Endpoint bereitstellen, der
`POST`-Events mit `Authorization: Bearer <BOT_WEBHOOK_SECRET>` entgegennimmt.
Die Startseite ist unter `http://localhost:3000` erreichbar.

## Integration

Alle Endpunkte erwarten den konfigurierten Schlüssel im Header `X-API-Key`.
Die API-Spezifikation liegt unter `docs/api/sommer-facade.yaml`.

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `POST` | `/api/v1/guild` | Server speichern |
| `GET` | `/api/v1/guild/{guildId}` | Server-Einstellungen abrufen |
| `PUT` | `/api/v1/guild/{guildId}` | Server-Einstellungen ersetzen |
| `GET` | `/api/v1/guild/{guildId}/level` | Alle Level eines Servers abrufen |
| `POST` | `/api/v1/guild/{guildId}/level` | Level anlegen |
| `GET` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level abrufen |
| `PUT` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level vollständig ersetzen |
| `DELETE` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level löschen |

Vor dem Erstellen einer farbigen Discord-Rolle muss der Bot
`GET /api/v1/guild/{guildId}` aufrufen und die Rolle nur anlegen, wenn
`colorsEnabled` den Wert `true` hat.

Serverdaten enthalten `guildId`, `name`, `iconUrl` (HTTPS-URL oder `null`) und
`colorsEnabled`. Beispiel für `POST /api/v1/guild`:

```json
{
  "guildId": "2347247625478",
  "name": "Sommer Community",
  "iconUrl": "https://cdn.example.com/server-icon.png",
  "colorsEnabled": true
}
```

Ein Level besteht aus `guildId`, `userId` und `xp` sowie optional `level`.
Beispiel für `POST`:

```json
{
  "guildId": "2347247625478",
  "userId": "123456789",
  "xp": 100,
  "level": 5
}
```

```bash
npm run generate
npm run lint
npm run typecheck
npm run build
```

`npm run generate` erstellt den Fetch-Client und die Modelle in
`src/generated/api`.