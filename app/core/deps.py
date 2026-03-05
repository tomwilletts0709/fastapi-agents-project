from dataclasses import dataclass

import httpx


@dataclass
class Dependencies:
    api_key: str
    http_client: httpx.AsyncClient
