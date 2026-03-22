from unittest.mock import MagicMock, patch

import pytest
from fastapi import FastAPI

from app.core.telemetry import (
    record_llm_usage,
    setup_telemetry,
    trace_current_span,
)


@pytest.mark.anyio
async def test_setup_telemetry():
    app = FastAPI()
    with patch("app.core.telemetry.FastAPIInstrumentor") as mock_instrumentor:
        setup_telemetry(app)
        mock_instrumentor.instrument_app.assert_called_once_with(app)


@pytest.mark.anyio
async def test_trace_current_span():
    span = trace_current_span()
    assert span is not None


@pytest.mark.anyio
async def test_record_llm_usage_records_attributes():
    mock_span = MagicMock()
    mock_span.is_recording.return_value = True

    mock_usage = MagicMock()
    mock_usage.opentelemetry_attributes.return_value = {
        "gen_ai.usage.input_tokens": 50,
        "gen_ai.usage.output_tokens": 50,
    }

    with patch("app.core.telemetry.trace.get_current_span", return_value=mock_span):
        record_llm_usage(mock_usage)

    assert mock_span.set_attribute.call_count == 2
    mock_span.set_attribute.assert_any_call("gen_ai.usage.input_tokens", 50)
    mock_span.set_attribute.assert_any_call("gen_ai.usage.output_tokens", 50)


@pytest.mark.anyio
async def test_record_llm_usage_skips_when_span_not_recording():
    mock_span = MagicMock()
    mock_span.is_recording.return_value = False

    mock_usage = MagicMock()
    mock_usage.opentelemetry_attributes.return_value = {"gen_ai.usage.input_tokens": 50}

    with patch("app.core.telemetry.trace.get_current_span", return_value=mock_span):
        record_llm_usage(mock_usage)

    mock_span.set_attribute.assert_not_called()


@pytest.mark.anyio
async def test_record_llm_usage_skips_when_usage_none():
    mock_span = MagicMock()
    mock_span.is_recording.return_value = True

    with patch("app.core.telemetry.trace.get_current_span", return_value=mock_span):
        record_llm_usage(None)

    mock_span.set_attribute.assert_not_called()
