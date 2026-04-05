"""One Agent per vendor/model. WebSearchTool is only on Anthropic (built-in support varies by provider)."""

from pydantic_ai import Agent, WebSearchTool
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.models.mistral import MistralModel
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.anthropic import AnthropicProvider
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.providers.groq import GroqProvider
from pydantic_ai.providers.mistral import MistralProvider
from pydantic_ai.providers.ollama import OllamaProvider
from pydantic_ai.providers.openai import OpenAIProvider

from app.ai.model_names import ModelName
from app.ai.prompts import system_prompt
from app.core.settings import settings

# Groq/Mistral/Google GLA reject empty api_key at provider init; use a placeholder so imports work without every key set.
_UNSET_KEY = "api-key-not-set"


def _key(value: str) -> str:
    return value.strip() or _UNSET_KEY


anthropic_model = AnthropicModel(
    "claude-3-5-sonnet-20240620",
    provider=AnthropicProvider(api_key=settings.anthropic_api_key),
)

anthropic_agent = Agent(
    anthropic_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)

openai_model = OpenAIChatModel(
    "gpt-4o-mini",
    provider=OpenAIProvider(api_key=_key(settings.openai_api_key)),
)

openai_agent = Agent(
    openai_model,
    system_prompt=system_prompt,
)

groq_model = GroqModel(
    "llama3-8b-8192",
    provider=GroqProvider(api_key=_key(settings.groq_api_key)),
)

groq_agent = Agent(
    groq_model,
    system_prompt=system_prompt,
)

# Ollama exposes an OpenAI-compatible chat API: OpenAIChatModel + OllamaProvider (not pydantic_ai.models.ollama).
ollama_model = OpenAIChatModel(
    "llama3",
    provider=OllamaProvider(base_url=settings.ollama_base_url),
)

ollama_agent = Agent(
    ollama_model,
    system_prompt=system_prompt,
)

google_model = GoogleModel(
    "gemini-2.5-flash",
    provider=GoogleProvider(api_key=_key(settings.google_api_key)),
)

google_agent = Agent(
    google_model,
    system_prompt=system_prompt,
)

mistral_model = MistralModel(
    "mistral-large-latest",
    provider=MistralProvider(api_key=_key(settings.mistral_api_key)),
)

mistral_agent = Agent(
    mistral_model,
    system_prompt=system_prompt,
)

AGENTS: dict[ModelName, Agent] = {
    ModelName.anthropic: anthropic_agent,
    ModelName.openai: openai_agent,
    ModelName.groq: groq_agent,
    ModelName.ollama: ollama_agent,
    ModelName.google: google_agent,
    ModelName.mistral: mistral_agent,
}

chat_agent = anthropic_agent
