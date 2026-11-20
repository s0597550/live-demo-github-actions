# Drehbuch Live-Demo (5 Minuten)

**Der Wow-Moment:** Du änderst live eine Zeile, die Pipeline baut und testet – und zwei Minuten später sieht der ganze Raum die neue Website, auch auf dem Handy.

Alles läuft im Browser auf github.com, kein Terminal nötig.

## Einmalig einrichten

1. **Settings → Pages → Build and deployment → Source: „GitHub Actions“** wählen.
2. Unter **Actions** den Workflow „CI“ einmal manuell starten (*Run workflow*) oder etwas auf `main` committen.
3. Wenn der Job „Website → GitHub Pages“ grün ist, steht im Lauf ein Link zur Website: `https://<dein-user>.github.io/kbe-github-actions-demo/`
4. **Keine** Branch-Protection auf `main` aktivieren – sonst klappt der direkte Commit in der Demo nicht.

## Am Vortag

- [ ] **Backup-PR mit Fehler:** `frontend/src/tasks.ts` öffnen → Stift → in `trimmed.length <= 80` die `80` durch `8` ersetzen → *Commit changes…* → „Create a new branch“ `demo-fehler` → *Propose changes* → *Create pull request*. Warten, bis der Frontend-Check **rot** ist. PR offen lassen.
- [ ] Secrets-Demo einmal starten (Actions → Secrets-Demo → *Run workflow*).
- [ ] Website öffnen: Grüne Akzentfarbe, „Build #…“ sichtbar.
- [ ] Generalprobe der Live-Änderung (Farbe ändern, warten, neu laden) – und danach wieder auf Grün zurückstellen.
- [ ] Screenshots machen: Website vorher/nachher, roter PR, `***` im Log.

## 10 Minuten vorher

- [ ] Eingeloggt, Browser-Zoom 125–150 %, Benachrichtigungen aus
- [ ] **Tab 1:** Website · **Tab 2:** roter PR · **Tab 3:** `frontend/src/config.ts` im Repo · **Tab 4:** Actions

## Ablauf

| Zeit | Aktion | Satz |
|---|---|---|
| 0:00 | Tab 1: Website zeigen, auf „Build #…“ zeigen | „Diese Website hat niemand von Hand hochgeladen – die Pipeline hat sie gebaut. Ihr könnt sie auf dem Handy öffnen.“ |
| 0:30 | Tab 2: roter PR → Check aufklappen → Step „Unit-Tests (Vitest)“ | „Hier hat jemand die Titel-Regel kaputt gemacht. Test rot – und deshalb geht **nichts** live.“ |
| 1:15 | Tab 3: `config.ts` → Stift → `accent: '#2da44e'` zu `'#8250df'` und `title` zu `'KBE Task-Board – live!'` | „Jetzt eine gewollte Änderung: neue Farbe, neuer Titel.“ |
| 1:40 | *Commit changes…* → „Commit directly to the main branch“ → *Commit changes* | „Ich committe direkt auf main.“ |
| 1:50 | Tab 4: neuer Lauf → Workflow-Graph | „Frontend mit Node 22 und 24 und das Backend laufen parallel. Der Pages-Job wartet auf das Frontend.“ |
| 2:30 | Actions → Secrets-Demo → *Run workflow* → Lauf öffnen → Step „Secret“ | „In der Wartezeit: Secrets. Im Log steht nur ***.“ |
| 3:30 | Zurück zum CI-Lauf: „Website → GitHub Pages“ grün | „Grün – die neue Version ist veröffentlicht.“ |
| 3:45 | Tab 1: **Cmd + Shift + R** (hart neu laden) | „Neue Farbe, neuer Titel, neue Build-Nummer. Vom Commit zur Website in zwei Minuten – ohne dass ich etwas hochgeladen habe.“ |
| 4:30 | Zurück zu PowerPoint | „Damit zurück zu euch.“ |

## Plan B

- **Pages-Job bei 3:45 noch nicht fertig:** „Der Deploy braucht noch einen Moment – ich lade die Seite gleich in der Diskussion neu.“ Dann während der Diskussion neu laden.
- **Website zeigt noch die alte Version:** privates Fenster öffnen oder hart neu laden (Cmd + Shift + R).
- **Kein Internet:** Screenshots zeigen.

## Danach

Farbe und Titel in `config.ts` wieder zurückstellen, den Fehler-PR schließen (**nicht mergen**).
