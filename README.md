# sommer-site

Next.js-Grundgerüst für die sommer.de REST API. Level werden in MongoDB
gespeichert. Die OpenAPI-Spezifikation liegt unter `docs/api/sommer-facade.yaml`.

## Starten

Voraussetzung: Node.js 20.9 oder neuer und eine erreichbare MongoDB-Instanz.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

In `.env.local` `MONGODB_URI` (einschließlich Datenbankname im URI-Pfad) und
einen eigenen `API_KEY` setzen. Die Startseite ist unter
`http://localhost:3000` erreichbar.

## API

Alle Endpunkte erwarten den konfigurierten Schlüssel im Header `X-API-Key`.

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `GET` | `/api/v1/guild/{guildId}/level` | Alle Level eines Servers abrufen |
| `POST` | `/api/v1/guild/{guildId}/level` | Level anlegen |
| `GET` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level abrufen |
| `PUT` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level vollständig ersetzen |
| `DELETE` | `/api/v1/guild/{guildId}/user/{userId}/level` | Level löschen |

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