from fastapi import HTTPException, status
from typing import Any

class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str, headers: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class NotFoundError(CustomHTTPException):
    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class BadRequestError(CustomHTTPException):
    def __init__(self, detail: str = "Bad request") -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class InternalServerError(CustomHTTPException):
    def __init__(self, detail: str = "Internal server error") -> None:
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)

class NoAgentWinnerVotesError(CustomHTTPException):
    def __init__(self, detail: str = "No agent winner votes") -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)