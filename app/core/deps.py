from dataclasses import dataclass

import httpx


@dataclass
class agent_deps:
    name: str
    description: str
    model: str
    system_prompt: str
    user_prompt: str
    assistant_prompt: str
    user_prompt: str

