# Drehbuch Live-Demo (5 Minuten)

Alles läuft im Browser auf github.com – kein Terminal nötig.

## Am Vortag

- [ ] **Backup-PR:** `frontend/src/tasks.ts` öffnen → Stift → in `trimmed.length <= 80` die `80` durch `8` ersetzen → *Commit changes…* → „Create a new branch“ `demo-backup` → *Propose changes* → *Create pull request*. Warten, bis der Frontend-Check rot ist. PR offen lassen.
- [ ] Secrets-Demo einmal starten (Actions → Secrets-Demo → Run workflow).
- [ ] Letzter Lauf auf `main` ist grün, unter *Packages* liegen zwei Images.
- [ ] Screenshots machen: roter PR, rotes Log, `***` im Log, Packages.

## 10 Minuten vorher

- [ ] Eingeloggt, Browser-Zoom 125–150 %, Benachrichtigungen aus
- [ ] Tab 1: Repo · Tab 2: Backup-PR · Tab 3: Actions

## Ablauf

| Zeit | Aktion | Satz |
|---|---|---|
| 0:00 | Repo zeigen, `.github/workflows/ci.yml` öffnen | „Das ist die Datei von der Folie.“ |
| 0:40 | `frontend/src/tasks.ts` → Stift → `80` zu `8` | „Jemand ändert die Titel-Regel, ohne an die Tests zu denken.“ |
| 1:10 | *Commit changes…* → neuer Branch `demo-live` → *Propose changes* → *Create pull request* | „Achtet unten auf die Checks.“ |
| 1:40 | *Details* → Workflow-Graph | „Drei Jobs gleichzeitig, Docker übersprungen, weil kein main.“ |
| 2:30 | Frontend-Job rot → Step „Unit-Tests (Vitest)“ aufklappen | „Der Fehler wird gefunden, bevor er in main landet.“ |
| 3:15 | Tab 3 → Secrets-Demo → *Run workflow* → Lauf öffnen | „Zweites Thema: Secrets.“ |
| 3:45 | Step „Secret (wird im Log maskiert)“ → `***` | „Im Log nur Sternchen.“ |
| 4:15 | Repo → *Packages* → Image | „So sieht das Ergebnis auf main aus.“ |
| 4:45 | Zurück zu PowerPoint | „Damit zurück zu euch.“ |

## Plan B

- Check bei 2:30 noch nicht fertig → Tab 2 (Backup-PR, schon rot).
- Secrets-Demo hängt → Lauf vom Vortag öffnen.
- Kein Internet → Screenshots.

Danach beide PRs schließen, **nicht mergen**.
