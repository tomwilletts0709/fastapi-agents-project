from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.settings import Settings

engine = create_async_engine(Settings.DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False, autoflush=False, autocommit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session