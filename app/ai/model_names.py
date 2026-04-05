from enum import Enum


class ModelName(str, Enum):
    anthropic = "anthropic"
    openai = "openai"
    groq = "groq"
    ollama = "ollama"
    google = "google"
    mistral = "mistral"
