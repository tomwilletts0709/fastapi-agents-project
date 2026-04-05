from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str
    secret_key: str
    redis_url: str = "redis://localhost:6379"
    debug: bool = False

    openai_api_key: str = ""
    groq_api_key: str = ""
    google_api_key: str = ""
    mistral_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"


settings = Settings()
