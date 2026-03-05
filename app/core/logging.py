from loguru import logger

logger.add("logs/app.log", rotation="100 MB", retention="7 days")


def setup_logging() -> None:
    logger.add("logs/app.log", rotation="100 MB", retention="7 days")


def get_logger():
    return logger