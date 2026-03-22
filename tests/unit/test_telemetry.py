from app.core.telemetry import setup_telemetry, trace_current_span, server_request_hook, client_request_hook, client_response_hook, record_llm_usage
from pytest import AsyncMock, pytest, fixture

@fixture
def mock_span():
    return AsyncMock(spec=Span)

@pytest.mark.anyio
async def test_setup_telemetry(mock_span):
    app = FastAPI()
    setup_telemetry(app)
    assert app.state.telemetry == True

@pytest.mark.anyio
async def test_trace_current_span(mock_span):
    span = trace_current_span()
    assert span is not None

@pytest.mark.anyio
async def test_llm_usage(mock_span):
    usage = Usage(total_tokens=100, prompt_tokens=50, completion_tokens=50)
    record_llm_usage(usage)
    assert mock_span.set_attribute.call_count == 3
    assert mock_span.set_attribute.call_args_list[0][0][0] == "llm.total_tokens"
    assert mock_span.set_attribute.call_args_list[0][0][1] == 100
    assert mock_span.set_attribute.call_args_list[1][0][0] == "llm.prompt_tokens"
    assert mock_span.set_attribute.call_args_list[1][0][1] == 50
    assert mock_span.set_attribute.call_args_list[2][0][0] == "llm.completion_tokens"
    assert mock_span.set_attribute.call_args_list[2][0][1] == 50