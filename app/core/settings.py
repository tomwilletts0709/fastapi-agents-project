from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str
    redis_url: str = "redis://localhost:6379"


settings = Settings()