# KBE Task-Board – GitHub Actions Demo

Demo-Projekt zur Präsentation **„GitHub Actions"** im Modul *WP Informatik – Komponentenbasierte Entwicklung* (WiSe 26/27).

Ein kleines Task-Board nach der Referenzarchitektur des Moduls:

| Komponente | Technologie | Ordner |
|---|---|---|
| Frontend | Vue 3 · TypeScript · Vite · Vitest · ESLint | `frontend/` |
| Backend | Quarkus · Jakarta REST · Bean Validation · OpenAPI | `backend/` |
| Schnittstelle | REST / JSON (`/api/tasks`), Swagger UI unter `/q/swagger-ui` | – |
| Automatisierung | GitHub Actions, Dependabot, Docker | `.github/` |

## Die Workflows

### `ci.yml` – CI-Pipeline

```
push / pull_request
        │
        ├── frontend (Matrix: Node 22, Node 24)  ─┐   lint → test → build → Artefakt
        │                                         ├── parallel
        ├── backend  (Java 21, Maven)            ─┘   mvn verify → Testberichte
        │
        ├── pages  (needs: frontend, nur auf main)
        │     └─ baut die Website und veröffentlicht sie auf GitHub Pages
        └── docker (needs: frontend + backend, nur auf main)
              └─ baut beide Images und pusht sie nach ghcr.io
```

Gezeigte Konzepte: Trigger (`on`), Jobs und Steps, `needs`, Matrix, Caching über `setup-node`/`setup-java`, Artefakte, `concurrency`, minimale `permissions`, `GITHUB_TOKEN`, Continuous Deployment auf GitHub Pages, Marketplace-Actions von Docker.

**Live-Website:** `https://<dein-user>.github.io/kbe-github-actions-demo/` – zeigt die Build-Nummer des Laufs, der sie veröffentlicht hat. Titel und Farbe stehen in `frontend/src/config.ts`.

### `publikum.yml` – Das Publikum steuert die Pipeline

```
Issue „Hallo von Lisa“ (vom Handy)
        │
        ├── gruss    Bot antwortet im Issue → Gruß in frontend/src/guestbook.json → Commit auf main
        └── website  (needs: gruss) Tests → Build → GitHub Pages → Bot: „✅ Live!“ + Issue schließen
```

Auf der Website tippt man auf **„Gruß senden“** und landet auf einem vorausgefüllten Issue. Die Website prüft alle 8 Sekunden `version.json` und lädt sich selbst neu, sobald eine neue Version live ist – der Beamer muss nicht angefasst werden.
Sicherheit: Der Issue-Titel ist fremde Eingabe. Er wird nur per Umgebungsvariable übergeben (keine Script-Injection), gekürzt und bereinigt (`frontend/src/guestbook.ts`, getestet in `guestbook.spec.ts`).
Plan B ohne Issue: *Actions → Publikum → Run workflow*. Einen unerwünschten Gruß entfernt man, indem man ihn aus `guestbook.json` löscht.

### `secrets-demo.yml` – Secrets und Variablen

Manuell startbar (`workflow_dispatch`). Zeigt den Unterschied zwischen Eingaben (`inputs`), Variablen (`vars`) und Secrets (`secrets`) – das Secret erscheint im Log nur als `***`.

### `dependabot.yml`

Öffnet wöchentlich Pull Requests, wenn es neue Versionen der Actions, npm- oder Maven-Pakete gibt.

## Einrichtung (einmalig, ohne Terminal)

1. Ordner mit **GitHub Desktop** öffnen: *File → Add local repository…*
2. **Publish repository** – Haken bei „Keep this code private“ entfernen (öffentlich = kostenlose Actions-Minuten).
3. **Settings → Pages → Source: „GitHub Actions“** wählen.
4. Auf github.com unter **Actions** prüfen, dass der Workflow „CI“ grün durchläuft (sonst einmal *Run workflow*). Der Job „Website → GitHub Pages“ verlinkt die Website.
5. Unter **Settings → Secrets and variables → Actions** anlegen:
   - Secret `DEMO_API_KEY` (beliebiger Wert)
   - Variable `DEPLOY_TARGET` (z. B. `staging`)
Keine Branch-Protection auf `main` aktivieren, damit in der Demo der direkte Commit klappt.

## Lokal starten

```bash
# alles mit einem Befehl (Docker)
docker compose up --build
# Frontend: http://localhost:5173   Backend: http://localhost:8080/q/swagger-ui

# oder einzeln im Dev-Modus
cd backend  && mvn quarkus:dev
cd frontend && npm run dev
```

## Lokal dieselben Prüfungen wie die CI ausführen

```bash
cd frontend && npm install && npm run lint && npm test && npm run build
cd backend  && mvn verify
```
