# 💸 Spendly

**Alle Abos, Kosten und Rechnungen an einem Ort – gespeichert in deinem eigenen Google Drive.**

👉 **https://andrasmarro.github.io/spendly/**

![Spendly Übersicht](docs/dashboard.png)

Spendly zeigt dir auf einen Blick, wie viel dich deine Abos pro Monat und pro Jahr kosten, wofür das Geld draufgeht,
wie viel du in ETFs & Aktien investierst und welche Zahlungen in den nächsten 12 Monaten anstehen. Zu jedem Abo kannst du die Rechnungen ablegen und später in Sekunden wiederfinden.

---

## Deine Daten gehören dir

![So fliessen die Daten: Browser ↔ dein Google Drive](docs/drive.svg)

Du meldest dich mit Google an, und Spendly legt in **deinem Drive** zwei Dinge an:

| In deinem Drive | Inhalt |
|---|---|
| 📄 `spendly-data.json` | Alle Abos, Kategorien und Einstellungen |
| 📁 `Spendly Rechnungen` | Deine hochgeladenen Rechnungen als ganz normale PDFs/Bilder |

- **Überall verfügbar:** Die Rechnungen liegen als echte Dateien in deinem Drive. Du kannst sie auch ohne Spendly öffnen,
  teilen oder herunterladen, am Handy, am PC oder in der Drive-App.
- **Kein Server, keine Datenbank:** Spendly läuft komplett im Browser und spricht direkt mit Google. Niemand ausser dir sieht deine Daten.
- **Minimale Rechte:** Spendly darf nur Dateien sehen, die es selbst angelegt hat, nicht den Rest deines Drives.
- **Gratis und werbefrei.**

---

## Abos im Griff

![Abo-Liste](docs/abos.png)

- Abos mit Betrag, Währung und Intervall erfassen (wöchentlich, monatlich, alle 2 Monate, vierteljährlich, alle 4 Monate, halbjährlich, jährlich)
- **ETF- & Aktien-Sparpläne, Säule 3a** in der Kategorie *Sparen & Investieren*. Sie werden getrennt von den Fixkosten ausgewiesen
- **Rund 30 Währungen** (CHF, EUR, USD, GBP, HUF …) mit tagesaktuellen EZB-Kursen, alles umgerechnet in deine Basiswährung
- Nächste Zahlung wird automatisch weitergerechnet
- Abos pausieren oder als gekündigt markieren, ohne die Historie zu verlieren
- Export als **CSV** für Excel oder die Steuererklärung

## Rechnungen hochladen

![Rechnung hochladen](docs/upload.png)

Mit einem Klick auf ⬆️ beim Abo lädst du eine oder mehrere Rechnungen (PDF oder Bild) hoch.
Datum und Betrag sind schon vorausgefüllt.

## Alles wiederfinden

![Rechnungssuche](docs/rechnungen.png)

Die Suche filtert schon beim Tippen nach Dateiname, Abo, Kategorie, Datum, Betrag und Notiz.
Sie findet **sogar Text in deinen PDFs** (über die Volltextsuche von Google Drive).
Zusätzlich kannst du nach Abo und Jahr filtern und siehst sofort die Summe der Treffer.

## Hell, Gedimmt oder Dunkel

Im Menü hinter deinem Profilbild wählst du das Design (oder automatisch nach System), die Basiswährung,
und dort findest du auch *Alle Daten löschen*.

![Gedimmtes Design mit Menü](docs/themes.png)

<img src="docs/mobile-dark.png" alt="Spendly auf dem Handy im Dark Mode" width="300">

---

## Kategorien

Klar abgegrenzt, ohne Doppelungen:

| Kategorie | Beispiele |
|---|---|
| 🎬 Medien & Unterhaltung | Netflix, Spotify, Games, Zeitungen |
| 💻 Software & Cloud | Adobe, iCloud, Microsoft 365, Domains |
| 📱 Telefon & Internet | Handy-Abo, Internet, TV-Anschluss |
| 🏠 Wohnen & Energie | Miete, Strom, Gas, Serafe |
| 🛡️ Versicherungen | Krankenkasse, Haftpflicht, Hausrat |
| 🚗 Mobilität | Halbtax/GA, Leasing, Parkplatz |
| 💪 Gesundheit & Sport | Fitnesscenter, Sportverein |
| 🎓 Bildung | Kurse, Sprach-Apps |
| 🏦 Finanzen & Mitgliedschaften | Kontogebühren, Kreditkarte, Spenden |
| 📈 Sparen & Investieren | ETF-Sparplan, Aktien, Säule 3a (zählt nicht als Kosten) |
| 📦 Sonstiges | alles andere |

## Ohne Anmeldung: Gastmodus

Du willst Spendly nur ausprobieren? Mit **„Als Gast fortfahren“** speichert Spendly alles nur in deinem Browser.
Das ist praktisch zum Testen, aber: **Wenn du die Browserdaten löschst, ist alles weg.** Für den Alltag lieber mit Google anmelden.
Über *Mit Google anmelden* im Gastmodus kannst du deine Gastdaten samt Rechnungen jederzeit ins Drive übernehmen.

---

<sub>Entwicklung: statische Seite ohne Build-Schritt (`index.html` + `lib.mjs`). Lokal starten mit `python3 -m http.server 8000`, Tests mit `node lib.test.mjs`.</sub>
