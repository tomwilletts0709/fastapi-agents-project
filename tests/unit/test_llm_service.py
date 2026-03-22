from unittest.mock import AsyncMock, MagicMock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.llm_service import LLMService


@pytest.fixture
def mock_session():
    session = AsyncMock(spec=AsyncSession)

    # _ensure_conversation_exists: execute returns result with scalar_one_or_none() -> conversation
    mock_conv_result = MagicMock()
    mock_conv_result.scalar_one_or_none.return_value = MagicMock()  # conversation exists
    session.execute = AsyncMock(side_effect=[mock_conv_result, MagicMock()])
    # Second execute is for load_messages - return empty messages
    mock_msg_result = MagicMock()
    mock_msg_result.scalars.return_value.all.return_value = []
    session.execute = AsyncMock(
        side_effect=[mock_conv_result, mock_msg_result]
    )
    session.add_all = MagicMock()
    session.commit = AsyncMock()

    return session


@pytest.fixture
def mock_agent():
    agent = MagicMock()
    mock_result = MagicMock()
    mock_result.output = "Mocked AI response"
    mock_result.usage.return_value = None
    agent.run = AsyncMock(return_value=mock_result)
    return agent


@pytest.mark.anyio
async def test_llm_service_send_message_returns_agent_output(
    mock_session, mock_agent
):
    llm_service = LLMService(agent=mock_agent)
    result = await llm_service.send_message(
        mock_session, conversation_id=1, user_message="Test message"
    )

    assert result == "Mocked AI response"
    mock_agent.run.assert_called_once()
    call_kwargs = mock_agent.run.call_args.kwargs
    assert call_kwargs["message_history"] == []
    mock_session.commit.assert_called_once()


@pytest.mark.anyio
async def test_llm_service_raises_404_when_conversation_not_found(mock_agent):
    from fastapi import HTTPException

    session = AsyncMock(spec=AsyncSession)
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None  # conversation not found
    session.execute = AsyncMock(return_value=mock_result)

    llm_service = LLMService(agent=mock_agent)

    with pytest.raises(HTTPException) as exc_info:
        await llm_service.send_message(session, conversation_id=999, user_message="Hi")

    assert exc_info.value.status_code == 404
    assert "999" in exc_info.value.detail
    mock_agent.run.assert_not_called()
