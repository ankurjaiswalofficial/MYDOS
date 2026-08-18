"""Request/response bodies for the todos router.

Separate from the model: the model is the storage shape, these are the wire
shape, and the two are allowed to drift (e.g. `id`/`created_at` are
server-assigned and never accepted from a client).
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TodoCreate(BaseModel):
    title: str
    done: bool = False


class TodoUpdate(BaseModel):
    title: str | None = None
    done: bool | None = None


class TodoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    done: bool
    created_at: datetime
