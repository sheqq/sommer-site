# Sommer Bot

Sommer unterstützt Discord-Communitys bei Levelständen und farbigen Rollen.
Diese Dokumentation beschreibt die Bot-Funktionen; die API-Spezifikation liegt
separat in `docs/api/sommer-facade.yaml`.

## Level und XP

Der Bot verwaltet XP und Levelstände pro Mitglied und Server. Er übermittelt
diese Werte an die Anwendung; die API speichert sie, berechnet aber selbst
keine Level.

## Farbige Rollen

Farbrollen sind serverabhängig. Bevor der Bot eine Farbrolle erstellt, ruft er
die Servereinstellungen ab und fährt nur fort, wenn `colorsEnabled` den Wert
`true` hat.

Serverinhaber können sich auf der Website mit Discord anmelden und die
Einstellung umschalten. Die Website prüft über Discord, dass der angemeldete
Nutzer tatsächlich Inhaber des Servers ist. Ein Eintrag in der
`servers`-Collection gilt als Nachweis, dass der Bot auf dem Server aktiv ist.

Bei einer Einstellungsänderung sendet die Website einen `POST` an
`BOT_WEBHOOK_URL` mit dem Header
`Authorization: Bearer <BOT_WEBHOOK_SECRET>` und diesem JSON-Body:

```json
{
  "eventId": "eindeutige-event-id",
  "type": "server.settings.updated",
  "guildId": "2347247625478",
  "colorsEnabled": true
}
```

Der Bot sollte die Nachricht als idempotenten aktuellen Zustand behandeln und
mit einem erfolgreichen HTTP-Status bestätigen. Der Bot muss Änderungen, die
er bereits über diesen Webhook erhalten hat, nicht per API zurückschreiben.

## Serverübersicht

Die Anwendung speichert Server-ID, Namen und Profilbild und zeigt die
registrierten Server auf der Startseite an.

## Projektumfang

Dieses Repository enthält die Webanwendung und die Schnittstelle zum Bot. Die
Discord-Aktionen und die konkrete Vergabe von XP/Leveln laufen im Bot selbst.
