from app.core.rate_limiting import RateLimitingMiddleware
from pytest import AsyncMock, pytest, fixture

@fixture
def mock_redis_client():
    return AsyncMock(spec=redis.Redis)

@pytest.mark.anyio
async def test_rate_limiting_middleware(mock_redis_client):
    middleware = RateLimitingMiddleware(redis_url="redis://localhost:6379", max_requests=5, time_window=60)
    middleware.redis_client = mock_redis_client

    request = Request(scope={"type": "http", "method": "GET", "path": "/"})
    response = await middleware.dispatch(request, AsyncMock())
    assert response.status_code == 200

async def test_rate_limiting_middleware_too_many_requests(mock_redis_client):
    middleware = RateLimitingMiddleware(redis_url="redis://localhost:6379", max_requests=5, time_window=60)
    middleware.redis_client = mock_redis_client

    request = Request(scope={"type": "http", "method": "GET", "path": "/"})
    response = await middleware.dispatch(request, AsyncMock())
    assert response.status_code == 429
    
    