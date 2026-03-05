from pydantic_ai import Agent
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.providers.anthropic import AnthropicProvider

from app.ai.prompts import system_prompt
from app.core.settings import settings

model = AnthropicModel(
    "claude-3-5-sonnet-20240620",
    provider=AnthropicProvider(api_key=settings.anthropic_api_key),
)
chat_agent = Agent(model, system_prompt=system_prompt)
        

