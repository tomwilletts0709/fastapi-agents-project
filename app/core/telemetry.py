from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry import trace
from opentelemetry.trace import Span
from typing import Any

def server_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_response_hook(span: Span, response: Response) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", response.status_code)

def record_llm_uasage(usage) -> None: 
    """ record llm token usage and passes result """
    span = trace.get_current_span()
    if spans and span.is_recording() and usage and hasattr(usage, "total_tokens"):
        attrs = usage.opentelemetry_attributes()
        for key, value in attrs.items():
            span.set_attribute(key, value)