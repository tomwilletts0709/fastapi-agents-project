import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
        
    def to_dict(self):
        return {"error": self.message}
        