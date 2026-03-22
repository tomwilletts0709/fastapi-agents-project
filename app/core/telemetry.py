from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry import trace
from starlette.responses import Response
from opentelemetry.trace import Span
from typing import Any

def setup_telemetry(app: FastAPI) -> None:
    FastAPIInstrumentor.instrument_app(app)

def trace_current_span() -> Span:
    return trace.get_current_span()

def server_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_request_hook(span: Span, scope: dict[str, Any]) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", scope.get("customer_user_id"))

def client_response_hook(span: Span, response: Response) -> None:
    if span and span.is_recording():
        span.set_attribute("customer_user_id", response.status_code)

def record_llm_usage(usage) -> None:
    """Record LLM token usage on the current span. Pass result.usage() from Pydantic AI."""
    span = trace.get_current_span()
    if span.is_recording() and usage and hasattr(usage, "opentelemetry_attributes"):
        attrs = usage.opentelemetry_attributes()
        for key, value in attrs.items():
            span.set_attribute(key, value)