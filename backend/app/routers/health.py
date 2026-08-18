from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])


class Health(BaseModel):
    status: str


@router.get("/health", response_model=Health)
async def health() -> Health:
    """Liveness. Deliberately touches nothing — a health check that queries the
    database reports the database, and then a slow query looks like a dead app."""
    return Health(status="ok")
