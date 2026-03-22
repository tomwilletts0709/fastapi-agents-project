from app.services.llm_service import LLMService
from pytest import AsyncMock, pytest, fixture

@fixture
def mock_session():
    return AsyncMock(spec=AsyncSession)

@pytest.mark.anyio
async def test_llm_service_send_message(mock_session):
    llm_service = LLMService()
    result = await llm_service.send_message(mock_session, 1, "Test message")
    assert result == "Test message"