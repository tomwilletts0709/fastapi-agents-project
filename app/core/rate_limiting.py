from collections.abc import Callable

import redis.asyncio as redis
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        *,
        redis_url: str,
        max_requests: int = 5,
        time_window: int = 60,
    ):
        super().__init__(app)
        self.max_requests = max_requests
        self.time_window = time_window
        self.redis_client = redis.from_url(redis_url, decode_responses=True)

    async def dispatch(self, request: Request, call_next: Callable):
        client_ip = request.client.host if request.client else "127.0.0.1"
        key = f"rate_limit:{client_ip}"

        try:
            current_count = await self.redis_client.incr(key)

            if current_count == 1: 
                await self.redis_client.expire(key, self.time_window)
            
            if current_count > self.max_requests:
                ttl = await self.redis_client.ttl(key)
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too Many Requests", "retry_after": ttl},
                )

            return await call_next(request)
        except Exception:
            return JSONResponse(
                status_code=500, content={"detail": "Internal Server Error"}
            )
