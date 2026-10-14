# 💸 Spendly

Abos, Kosten und Rechnungen verwalten – eine statische Seite auf GitHub Pages, Login mit Google.
Alle Daten liegen in **deinem eigenen Google Drive** (`spendly-data.json` + Ordner `Spendly Rechnungen`).
Kein Server, keine Datenbank, keine Kosten. Die App sieht nur Dateien, die sie selbst angelegt hat (Scope `drive.file`).

**Features:** Dashboard (Monats-/Jahreskosten, Kosten pro Kategorie, nächste Zahlungen) · Abos anlegen/bearbeiten/pausieren ·
Multi-Währung CHF/EUR/USD/GBP mit Live-Kursen (frankfurter.dev) · Rechnungen (PDF/Bild) pro Abo hochladen ·
Rechnungs-Sammlung mit Live-Suche über Name, Abo, Kategorie, Datum, Betrag, Notiz **und PDF-Inhalt** (Google-Drive-Volltextindex) ·
Filter nach Abo/Jahr · CSV-Export · Dark Mode · Mobile.

## Einmalige Einrichtung: Google Client ID

1. https://console.cloud.google.com → neues Projekt anlegen.
2. **APIs & Services → Library** → „Google Drive API“ aktivieren.
3. **APIs & Services → OAuth consent screen** → External, App-Name eintragen, dich selbst als **Test user** hinzufügen
   (oder „Publish app“ – `drive.file` braucht keine Google-Prüfung).
4. **Credentials → Create credentials → OAuth client ID → Web application**
   - Authorized JavaScript origins: `https://andrasmarro.github.io` (und `http://localhost:8000` zum lokalen Testen)
5. Client ID in `index.html` bei `const CLIENT_ID = '…'` eintragen, committen – fertig.

## Lokal starten / testen

```bash
python3 -m http.server 8000   # → http://localhost:8000
node lib.test.mjs             # Logik-Tests
```

## Kategorien

Medien & Unterhaltung · Software & Cloud · Telefon & Internet · Wohnen & Energie · Versicherungen ·
Mobilität · Gesundheit & Sport · Bildung · Finanzen & Mitgliedschaften · Sonstiges
