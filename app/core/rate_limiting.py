
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

"""adding boilerplate code for rate limiting"""

class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI):
        super().__init__(app)
        self.redis_client = Redis(host="localhost", port=6379, db=0)

    async def dispatch(self, request: Request, call_next: Callable):
        return await call_next(request)