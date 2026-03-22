from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app


async def override_get_db():
    """Yield a mock DB session for testing."""
    session = AsyncMock(spec=AsyncSession)
    mock_conversation = MagicMock()
    mock_conversation.id = 1
    session.add = MagicMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock(side_effect=lambda obj: setattr(obj, "id", 1))
    yield session


@pytest.fixture
def client():
    app.dependency_overrides = {}
    return app


@pytest.mark.anyio
async def test_create_conversation_returns_id(client):
    from app.models.db import get_db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        response = await ac.post("/conversation")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == 1
