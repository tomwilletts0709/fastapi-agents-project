from app.core.logging import setup_logging
from loguru import logger

def test_setup_logging():
    output = []

    setup_logging()

    handler_id = logger.add(
        lambda message: output.append(str(message).strip()),
        format="{message}",
        level="INFO",
    )

    logger.info("Test logging")

    logger.remove(handler_id)

    assert output == ["Test logging"]