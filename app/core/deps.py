from dataclasses import dataclass
from typing import Any

@dataclass
class Depedencies: 
    api_key: str
    http_client: httpx.AsyncClient



    