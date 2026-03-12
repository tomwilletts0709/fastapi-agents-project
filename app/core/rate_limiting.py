
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import redis.asyncio as redis


class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, redis_url: str, max_requests: int = 5, time_window: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.time_window = time_window
        self.redis_client = redis.from_url(redis_url, decode_responses=True)

    async def dispatch(self, request: Request, call_next: Callable) -> None:
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}"

        try:
            current_count = await self,redis_client.incr(key)

            if current_count == 1: 
                await self.redis_client.expire(key, self.time_window)
            
            if current_count > self.max_requests:
                ttl = await self.redis_client.ttl(key)
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too Many Requests", "retry_after": ttl},
                )

            return await call_next(request)
        except Exception as e:
            return JSONResponse(
                status_code=500, content={"detail": "Internal Server Error"})

        response = await call_next(request)
        return response
