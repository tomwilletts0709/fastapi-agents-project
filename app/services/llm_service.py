from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import HTTPException
from pydantic_ai import ModelRequest, ModelResponse, TextPart, UserPromptPart

from app.ai.agents import chat_agent
from app.models.models import Conversation, Message, Project


class LLMService:
    """Orchestrates chat: load history → run agent → persist messages."""

    def __init__(self, agent=chat_agent):
        self.agent = agent

    async def send_message(
        self,
        session: AsyncSession,
        conversation_id: int,
        user_message: str,
    ) -> str:
        """Run agent with conversation history, persist new messages, return response."""
        await self._ensure_conversation_exists(session, conversation_id)
        history = await self.load_messages(session, conversation_id)
        result = await self.agent.run(user_message, message_history=history)
        await self.save_messages(session, conversation_id, user_message, result.output)
        usage = result.usage()
        if usage and usage.has_values():
            from app.core.telemetry import record_llm_usage

            record_llm_usage(usage)
        return result.output

    async def _ensure_conversation_exists(
        self, session: AsyncSession, conversation_id: int
    ) -> None:
        stmt = select(Conversation).where(Conversation.id == conversation_id)
        result = await session.execute(stmt)
        if result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=404, detail=f"Conversation {conversation_id} not found"
            )

    async def load_messages(
        self,
        session: AsyncSession,
        conversation_id: int,
    ) -> list[ModelRequest | ModelResponse]:
        """Load messages from DB and convert to Pydantic AI format."""
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )
        result = await session.execute(stmt)
        messages = result.scalars().all()

        history: list[ModelRequest | ModelResponse] = []
        for m in messages:
            if m.role == "user":
                history.append(ModelRequest(parts=[UserPromptPart(content=m.content)]))
            else:
                history.append(ModelResponse(parts=[TextPart(content=m.content)]))
        return history

    async def save_messages(
        self,
        session: AsyncSession,
        conversation_id: int,
        user_content: str,
        agent_content: str,
    ) -> None:
        """Persist user and assistant messages."""
        user_message = Message(
            conversation_id=conversation_id,
            content=user_content,
            role="user",
        )
        agent_message = Message(
            conversation_id=conversation_id,
            content=agent_content,
            role="assistant",
        )
        session.add_all([user_message, agent_message])
        await session.commit()

    async def create_conversation(
        self, 
        session: AsyncSession,
        user_id: int, 
        agent_id: int,
    ) -> int: 
        """ createt a new conversation with agent """
        create_conversation = Conversation(user_id=user_id, agent_id=agent_id)
        session.add(create_conversation)
        await session.commit()
        await session.refresh(create_conversation)
        return create_conversation.id

    async def get_conversation(
        self, 
        sesssion: AsyncSession,
        user_id: int,
        conversation_id: int, 
    ) -> Conversation | None:
        """ grab the conversation for a user """
        session.execute(select(Conversation).where(Conversation.user_id == user_id, Conversation.id == conversation_id))
        return result.scalar_one_or_none()

    async def delete_conversation(
        self, 
        session: AsyncSession, 
        user_id: int,
        conversation_id: int,
    ) -> None: 
        """ delete the conversation for a user """
        session.execute(select(Conversation).where(Conversation.user_id == user_id, Conversation.id == conversation_id))
        return result.scalar_one_or_none()
        await session.commit()
        await session.refresh(delete_conversation)
        return delete_conversation.id

    async def create_project(
        self, 
        session: AsyncSession,
        project_name: str,
        project_description: str,
        user_id: int,
    ) -> int: 
        """ create a new project for a user """
        create_project = Project 