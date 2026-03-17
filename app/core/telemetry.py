from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.trace import Span
from typing import Any

def server_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if spans and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if spans and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_response_hook(span: Span, response: Response) -> None:
    if spans and span.is_recording():
        span.set_attribute("customer_user_id", response.status_code)