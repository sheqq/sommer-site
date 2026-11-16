# sommer-site

Next.js-Grundgerüst für die sommer.de REST API. Die Endpunkte entsprechen der
OpenAPI-Spezifikation in `sommer-facade.yaml` und speichern Nutzer in MongoDB.

## Starten

Voraussetzung: Node.js 20.9 oder neuer und eine erreichbare MongoDB-Instanz.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

In `.env.local` `MONGODB_URI`, optional `MONGODB_DB` und einen eigenen `API_KEY`
setzen. Die Startseite ist unter `http://localhost:3000` erreichbar.

## API

Alle Endpunkte erwarten den konfigurierten Schlüssel im Header `X-API-Key`.

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `GET` | `/api/v1/users` | Alle Nutzer abrufen |
| `POST` | `/api/v1/users` | Nutzer anlegen |
| `GET` | `/api/v1/users/{userId}` | Nutzer abrufen |
| `PUT` | `/api/v1/users/{userId}` | Nutzer vollständig ersetzen |
| `DELETE` | `/api/v1/users/{userId}` | Nutzer löschen |

Ein Nutzer besteht aus `id` und `username`. Beispiel für `POST`:

```json
{
  "id": "2347247625478",
  "username": "Max"
}
```

```bash
npm run lint
npm run typecheck
npm run build
```