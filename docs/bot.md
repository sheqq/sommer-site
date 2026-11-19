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

## Serverübersicht

Die Anwendung speichert Server-ID, Namen und Profilbild und zeigt die
registrierten Server auf der Startseite an.

## Projektumfang

Dieses Repository enthält die Webanwendung und die Schnittstelle zum Bot. Die
Discord-Aktionen und die konkrete Vergabe von XP/Leveln laufen im Bot selbst.
