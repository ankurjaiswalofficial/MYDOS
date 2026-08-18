# MYDOS

A small todo app. FastAPI + SQLAlchemy backend, React + MUI frontend, shipped
as one container that serves both.

## Run it locally (without Docker)

Two terminals, backend first.

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

```bash
cd frontend
bun install
cp .env.example .env   # VITE_API_URL=http://localhost:8000
bun run dev
```

Open the URL Vite prints (`http://localhost:5173`).

## Build and run the image

```bash
docker build -t mydos:local .
docker run -p 8000:8000 mydos:local
```

Open `http://localhost:8000` — the backend serves the built frontend and its
own API from the same origin, so no `VITE_API_URL` is needed in this mode.

The container listens on `$PORT` (default `8000`) and binds `0.0.0.0`. Migrations
run automatically on startup.

## Configuration

Backend (`backend/.env`, see `backend/.env.example`):

| Variable            | Default                              |
| -------------------- | ------------------------------------- |
| `APP_NAME`           | `MYDOS`                               |
| `APP_DEBUG`           | `1`                                    |
| `APP_CORS_ORIGINS`    | `["*"]`                                |
| `APP_DATABASE_URL`    | `sqlite+aiosqlite:///./mydos.db`      |

Frontend (`frontend/.env`, see `frontend/.env.example`), only used when the
frontend is served separately from the backend (e.g. `bun run dev`):

| Variable         | Default                     |
| ----------------- | ---------------------------- |
| `VITE_API_URL`     | `http://localhost:8000`      |

## Layout

```
backend/    FastAPI service — app/, alembic/, tests/
frontend/   React + MUI UI — src/
Dockerfile  Multi-stage build: bun builds the frontend, the backend serves it
```

## Tests

```bash
cd backend && uv run pytest
cd frontend && bun run test
```
