from pydantic_ai import Agent, WebSearchTool
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.providers import ollama
from pydantic_ai.providers.anthropic import AnthropicProvider
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.providers.groq import GroqProvider
from pydantic_ai.models.ollama import OllamaModel
from pydantic_ai.providers.ollama import OllamaProvider
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.providers.openai import OpenAIProvider
from app.ai.prompts import system_prompt
from app.core.settings import settings

anthropic_model = AnthropicModel(
    "claude-3-5-sonnet-20240620",
    provider=AnthropicProvider(api_key=settings.anthropic_api_key),
)

anthropic_agent = Agent(
    anthropic_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)

openai_model = OpenAIModel(
    "gpt-4o-mini",
    provider=OpenAIProvider(api_key=settings.openai_api_key),
)

openai_agent = Agent(
    openai_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)
        
groq_model = GroqModel(
model = GroqModel(
    "llama3-8b-8192",
    provider=GroqProvider(api_key=settings.groq_api_key),
)

groq_agent = Agent(
    groq_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)

ollama_model = OllamaModel(
    "llama3-8b-8192",
    provider=OllamaProvider(api_key=settings.ollama_api_key),
)

ollama_agent = Agent(
    ollama_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)

google_model = GoogleModel(
    "gemini-2.5-flash",
    provider=GoogleProvider(api_key=settings.google_api_key),
)

chat_agent = Agent(
    google_model,
    system_prompt=system_prompt,
    builtin_tools=[WebSearchTool()],
)