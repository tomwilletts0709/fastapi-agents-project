from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.settings import settings

engine = create_async_engine(settings.database_url, echo=settings.debug)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False, autoflush=False, autocommit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session