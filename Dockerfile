# --- Stage 1: build the frontend -------------------------------------------
# Full bun toolchain, dev dependencies included. Produces dist/ and nothing
# from this stage crosses into the runtime image.
FROM oven/bun:1 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
# No VITE_API_URL here: the app is served by the same backend, from the same
# origin, so the client's relative default (see src/api.ts) is what runs.
RUN bun run build

# --- Stage 2: runtime --------------------------------------------------------
# The backend's base image, production dependencies only, backend source, and
# the built frontend copied in as static files.
FROM python:3.13-slim AS runtime
WORKDIR /app

RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY backend/app ./app
COPY backend/alembic ./alembic
COPY backend/alembic.ini ./

# The built frontend, served as static files with an SPA fallback (app/main.py).
COPY --from=frontend-build /app/frontend/dist ./static

ENV PATH="/app/.venv/bin:$PATH"
ENV APP_DATABASE_URL="sqlite+aiosqlite:///./mydos.db"

EXPOSE 8000

# The port comes from the environment; 0.0.0.0 because a container bound to
# loopback is reachable from nothing outside it. Migrations run before the
# server starts so a fresh container has a schema, not just an app. Calling
# the venv's own binaries directly, not `uv run` — `uv run` re-syncs against
# pyproject.toml on every start, which pulls the dev dependency group back in
# over the network and defeats the point of `--no-dev` at build time.
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
