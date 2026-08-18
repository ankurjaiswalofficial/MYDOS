from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoRead, TodoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get("", response_model=list[TodoRead])
async def list_todos(session: SessionDep) -> list[Todo]:
    result = await session.execute(select(Todo).order_by(Todo.id))
    return list(result.scalars().all())


@router.post("", response_model=TodoRead, status_code=201)
async def create_todo(body: TodoCreate, session: SessionDep) -> Todo:
    todo = Todo(title=body.title, done=body.done)
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def _get_or_404(todo_id: int, session: AsyncSession) -> Todo:
    todo = await session.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo(todo_id: int, session: SessionDep) -> Todo:
    return await _get_or_404(todo_id, session)


@router.patch("/{todo_id}", response_model=TodoRead)
async def update_todo(todo_id: int, body: TodoUpdate, session: SessionDep) -> Todo:
    todo = await _get_or_404(todo_id, session)
    if body.title is not None:
        todo.title = body.title
    if body.done is not None:
        todo.done = body.done
    await session.commit()
    await session.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=204)
async def delete_todo(todo_id: int, session: SessionDep) -> None:
    todo = await _get_or_404(todo_id, session)
    await session.delete(todo)
    await session.commit()
