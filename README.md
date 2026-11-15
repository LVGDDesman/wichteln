# 🎄 Wichteln

Kleine Web-App fürs Wichteln: Alle Teilnehmenden registrieren sich und tragen Wunsch und Adresse ein. Zum Stichtag
lost das Backend automatisch aus (alle bilden einen zufälligen Kreis, niemand zieht sich selbst) und verschickt
an alle eine Mail. Danach sieht jede:r Wunsch und Adresse des eigenen Wichtels.

| Teil       | Stack                                                                  |
| ---------- | ---------------------------------------------------------------------- |
| `frontend` | React 19, React Router, Tailwind CSS 4, i18next, Vite – ausgeliefert per nginx |
| `backend`  | Node 24+, Express 5, TypeScript, MariaDB, OpenAPI-Validierung, nodemailer |

## Betrieb mit Docker

Voraussetzungen in `~/docker_data/wichteln/`:

- `mariadb.env` – z. B.
  ```env
  MARIADB_ROOT_PASSWORD=…
  MARIADB_DATABASE=wichteln
  MARIADB_USER=wichteln
  MARIADB_PASSWORD=…
  ```
- `config.json` – Kopie von [backend/config.json.template](backend/config.json.template) mit echten Werten
  (`db.host` ist `mariadb.local`, `jwt.secret` mind. 32 zufällige Zeichen, `wichteln.enddate` = Stichtag mit Zeitzone).

```sh
docker compose -f compose-wichteln.yaml up -d --build
```

- Frontend: <http://localhost:5173> (nginx, leitet `/api` an das Backend weiter)
- Backend: <http://localhost:3000/api/health>

Das Datenbankschema wird beim Start des Backends automatisch angelegt.

## Entwicklung

```sh
# Datenbank
docker compose up -d

# Backend (lädt Änderungen automatisch neu)
cd backend
cp config.json.template config.json   # Werte anpassen, db.host=localhost
npm install
npm run dev

# Frontend (http://localhost:5173, /api wird an :3000 weitergeleitet)
cd frontend
npm install
npm run dev
```

Das Backend läuft im Dev-Modus direkt als TypeScript (Node Type Stripping), für Produktion wird mit `npm run build` nach
`dist/` kompiliert.

### Tests & Checks

```sh
cd backend
npm run typecheck
npm test                                                   # Unit-Tests
INTEGRATION=1 CONFIG_PATH=./config.test.json npm test      # + API-Tests gegen eine Wegwerf-Datenbank

cd frontend
npm run lint
npm run build
```

## API

Spezifiziert in [backend/wichteln_api.yaml](backend/wichteln_api.yaml) – Requests werden dagegen validiert.

| Methode  | Pfad                         | Beschreibung                                 |
| -------- | ---------------------------- | -------------------------------------------- |
| `POST`   | `/api/user/create`           | Registrieren (liefert Token)                 |
| `POST`   | `/api/user/authenticate`     | Login mit Name **oder** E-Mail               |
| `POST`   | `/api/user/reset`            | Neues Passwort per Mail                      |
| `GET`    | `/api/user`                  | Eigenes Konto                                |
| `PATCH`  | `/api/user`                  | Konto ändern                                 |
| `DELETE` | `/api/user`                  | Konto löschen (nur vor dem Stichtag)         |
| `GET`    | `/api/wichtel/status`        | Stichtag, ob vorbei, ob ausgelost            |
| `GET`    | `/api/wichtel`               | Eigener Wunsch + Adresse                     |
| `POST`   | `/api/wichtel`               | Wunsch/Adresse speichern (nur vor Stichtag)  |
| `GET`    | `/api/wichtel/wichtelee`     | Mein Wichtel (404 solange nicht ausgelost)   |
| `POST`   | `/api/wichtel/end`           | Auslosung manuell anstoßen                   |

## Neues Jahr, neues Wichteln

`wichteln.enddate` in der `config.json` anpassen und die alten Zuordnungen zurücksetzen:

```sql
UPDATE user SET wichtelee = NULL, wish = NULL;
```
