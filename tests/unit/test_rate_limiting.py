from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import FastAPI
from starlette.responses import Response

from app.core.rate_limiting import RateLimitingMiddleware


@pytest.fixture
def app():
    return FastAPI()


@pytest.fixture
def mock_redis():
    client = AsyncMock()
    client.expire = AsyncMock(return_value=True)
    client.ttl = AsyncMock(return_value=60)
    return client


async def call_next(request):
    return Response(status_code=200)


@pytest.mark.anyio
async def test_rate_limiting_allows_request_under_limit(app, mock_redis):
    mock_redis.incr = AsyncMock(return_value=1)

    middleware = RateLimitingMiddleware(
        app, redis_url="redis://localhost:6379", max_requests=5, time_window=60
    )
    middleware.redis_client = mock_redis

    request = MagicMock()
    request.client = MagicMock()
    request.client.host = "127.0.0.1"

    response = await middleware.dispatch(request, call_next)

    assert response.status_code == 200
    mock_redis.incr.assert_called_once()
    mock_redis.expire.assert_called_once()


@pytest.mark.anyio
async def test_rate_limiting_returns_429_when_over_limit(app, mock_redis):
    mock_redis.incr = AsyncMock(return_value=6)

    middleware = RateLimitingMiddleware(
        app, redis_url="redis://localhost:6379", max_requests=5, time_window=60
    )
    middleware.redis_client = mock_redis

    request = MagicMock()
    request.client = MagicMock()
    request.client.host = "127.0.0.1"

    response = await middleware.dispatch(request, call_next)

    assert response.status_code == 429
    mock_redis.incr.assert_called_once()
