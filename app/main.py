import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

load_dotenv()

from app.core.logging import setup_logging
from app.core.rate_limiting import RateLimitingMiddleware
from app.core.telemetry import setup_telemetry
from app.core.settings import settings
from app.api import router


setup_logging()
logger.info("Starting the application")
logger.info("Loading environment variables")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitingMiddleware, redis_url=settings.redis_url)

setup_telemetry(app)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)