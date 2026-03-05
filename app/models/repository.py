from app.models.models import Base
from sqlalchemy import select
from app.models.db import SessionLocal

class Repository:
    def __init__(self, model: Base | None = None, entity_id: int | None = None):
        self.SessionFactory = SessionLocal
        self.model = model
        self.entity_id = entity_id

    async def get_by_id(self, model: type[Base], entity_id: int) -> Base | None:
        async with self.SessionFactory() as session:
            result = await session.execute(select(model).where(model.id == entity_id))
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
            session.delete(self.model)
            await session.commit()
            return self.model