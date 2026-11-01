# Drehbuch Live-Demo (5 Minuten)

## Vorbereitung (am Vortag / 15 Min vor dem Vortrag)

- [ ] Repo ist gepusht, letzter Lauf auf `main` ist **grün**, Images liegen unter *Packages*
- [ ] Secret `DEMO_API_KEY` und Variable `DEPLOY_TARGET` sind angelegt
- [ ] Branch `demo/kaputter-test` vorbereitet (siehe unten), **noch nicht** als PR geöffnet
- [ ] Browser-Tabs offen: ① Repo-Startseite ② `ci.yml` ③ Actions-Tab ④ Packages
- [ ] Browser-Zoom auf 125–150 %, Benachrichtigungen aus, im GitHub-Account eingeloggt
- [ ] Backup: Screenshots eines roten und eines grünen Laufs im Ordner `backup/`

### Branch mit absichtlich kaputtem Test vorbereiten

```bash
git switch -c demo/kaputter-test
# in frontend/src/tasks.ts: Grenze von 80 auf 8 Zeichen ändern
#   return trimmed.length > 0 && trimmed.length <= 8
git commit -am "feat: kürzere Titel erlauben"
git push -u origin demo/kaputter-test
git switch main
```

## Ablauf

| Zeit | Was du zeigst | Was du sagst |
|---|---|---|
| 0:00 | Tab ① → „Compare & pull request" für `demo/kaputter-test` → PR öffnen | „Eine Kollegin ändert die Titel-Regel und öffnet einen Pull Request. Achtet darauf, was unten im PR passiert." |
| 0:30 | Tab ② `ci.yml` kurz durchscrollen | „Das ist genau der Workflow von der Folie: drei Jobs, Frontend als Matrix, Docker nur auf main." |
| 1:15 | Zurück zum PR → Checks laufen, auf **Details** klicken → Workflow-Graph | „Frontend und Backend laufen parallel auf eigenen VMs, die Matrix erzeugt zwei Frontend-Jobs." |
| 2:00 | Frontend-Job wird **rot** → Step „Unit-Tests" aufklappen | „Vitest meldet: ‚CI-Pipeline bauen' ist plötzlich ungültig. Der Fehler wird gefunden, bevor er in main landet." |
| 2:45 | Im PR: „Merge" ist durch Branch Protection gesperrt (falls aktiviert) | „Ohne grüne Checks kein Merge – die Qualitätsregel ist automatisiert." |
| 3:00 | Tab ③ → *Secrets-Demo* → **Run workflow** → Name eingeben → Lauf öffnen | „Zweites Thema: Secrets." |
| 3:45 | Log zeigt `Versuch, das Secret auszugeben: ***`, danach Summary-Tabelle | „Der Wert ist im Runner vorhanden, im Log wird er aber automatisch maskiert." |
| 4:15 | Tab ④ Packages → Image `…-backend` mit Tag `sha-…` | „Auf main entsteht automatisch ein Docker-Image, angemeldet nur mit dem GITHUB_TOKEN." |
| 4:45 | Zurück zu den Folien | „Damit zurück zum Fazit." |

## Falls etwas schiefgeht

- **Runner startet nicht / GitHub langsam:** auf einen bereits abgeschlossenen roten Lauf (vorher einmal erzeugen!) und den grünen Lauf auf `main` wechseln.
- **Kein Internet:** Backup-Screenshots zeigen.
- **Zeit knapp:** Secrets-Demo weglassen, direkt zu Packages.

Nach dem Vortrag den PR schließen (nicht mergen).
