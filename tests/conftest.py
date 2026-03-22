# Set test env vars before any app imports.
import os

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key-for-pytest")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
