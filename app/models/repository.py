import os
from app.models.models import Base
from sqlalchemy import select
from app.models.db import SessionLocal

class Repository:
    def __init__(self, model: Base, id: int):
        self.SessionFactory = SessionLocal()
        self.model = model
        self.id = id

    async def get_by_id(self) -> Base | None:
        async with self.SessionFactory() as session:
            result = await session.execute(select(self.model).where(self.model.id == self.id))
            return result.scalar_one_or_none()

    async def create(self) -> Base:
        async with self.SessionFactory() as session:
            session.add(self.model)
            await session.commit()
            await session.refresh(self.model)
            return self.model

    async def update(self) -> Base:
        async with self.SessionFactory() as session:
            session.add(self.model)
            await session.commit()
            await session.refresh(self.model)
            return self.model

    async def delete(self) -> Base:
        async with self.SessionFactory() as session:
            await session.delete(self.model)
            await session.commit()
            