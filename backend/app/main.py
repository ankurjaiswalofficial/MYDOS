from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .routers import health, todos
from .settings import settings

app = FastAPI(title=settings.name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# One router per domain, mounted here. Routes defined directly on `app` are how
# a main module becomes the place every feature is edited at once.
app.include_router(health.router, prefix="/api")
app.include_router(todos.router, prefix="/api")

# The frontend's built assets, copied in as the final layer of the container
# image. Absent in local dev (nobody has run a frontend build here), so this
# only mounts when the directory actually exists.
static_dir = Path(__file__).resolve().parent.parent / "static"
if static_dir.is_dir():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa(full_path: str) -> FileResponse:
        """Serve the SPA's own files by name, and its router's deep links by
        falling back to index.html — a 404 here would be a client route the
        server has never heard of, not a page that doesn't exist."""
        candidate = static_dir / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(static_dir / "index.html")
