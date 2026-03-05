from pydantic_settings import BaseSettings

class Settings(BaseSettigns): 
    database_url: str
    anthropic_api_key: str
    model: str
    system_prompt: str
    user_prompt: str
    assistant_prompt: str
    user_prompt: str


settings = Settings()