from loguru import logger 
from typing import Any
import sys

def setup_logging() -> None:
    logger.remove()
    logger.add("logs/app.log", format="{time} {level} {message}", rotation="100 MB", retention="7 days", level="INFO")
    logger.add(sys.stdout, format="{time} {level} {message}", level="INFO")

log = logger.bind(service="chat-agent")