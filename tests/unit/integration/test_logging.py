from app.core.logging import setup_logging
from loguru import logger

def test_setup_logging(): 
    setup_logging()
    logger.info("Test logging")
    assert logger.level == "INFO"
    assert logger.name == "chat-agent"