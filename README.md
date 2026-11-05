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
        └── docker (needs: frontend + backend, nur auf main)
              └─ baut beide Images und pusht sie nach ghcr.io
```

Gezeigte Konzepte: Trigger (`on`), Jobs und Steps, `needs`, Matrix, Caching über `setup-node`/`setup-java`, Artefakte, `concurrency`, minimale `permissions`, `GITHUB_TOKEN`, Marketplace-Actions von Docker.

### `secrets-demo.yml` – Secrets und Variablen

Manuell startbar (`workflow_dispatch`). Zeigt den Unterschied zwischen Eingaben (`inputs`), Variablen (`vars`) und Secrets (`secrets`) – das Secret erscheint im Log nur als `***`.

### `dependabot.yml`

Öffnet wöchentlich Pull Requests, wenn es neue Versionen der Actions, npm- oder Maven-Pakete gibt.

## Einrichtung (einmalig, ohne Terminal)

1. Ordner mit **GitHub Desktop** öffnen: *File → Add local repository…*
2. **Publish repository** – Haken bei „Keep this code private“ entfernen (öffentlich = kostenlose Actions-Minuten).
3. Auf github.com unter **Actions** prüfen, dass der Workflow „CI“ grün durchläuft.
4. Unter **Settings → Secrets and variables → Actions** anlegen:
   - Secret `DEMO_API_KEY` (beliebiger Wert)
   - Variable `DEPLOY_TARGET` (z. B. `staging`)
5. Optional: **Settings → Branches** für `main` „Require status checks to pass“ aktivieren.

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
