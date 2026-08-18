"""Every environment-varying value, declared once.

Declared rather than read at the call site: a `os.environ.get` scattered through
routers is how one default becomes true in one file and false in another, and
the disagreement is invisible until something behaves differently in production.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_", extra="ignore")

    name: str = "MYDOS"
    debug: bool = True
    #: Browser origins allowed to call this API. `["*"]` is a development
    #: convenience; naming real origins is what a deployment does.
    cors_origins: list[str] = ["*"]
    #: SQLAlchemy async URL. A file-based sqlite by default so the app runs
    #: with zero setup; a real deployment points this at a real database.
    database_url: str = "sqlite+aiosqlite:///./mydos.db"


settings = Settings()
