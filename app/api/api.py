from typing import Annotated

from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db import get_db
from app.models.models import Conversation
from app.services.llm_service import LLMService

router = APIRouter()


def get_llm_service() -> LLMService:
    return LLMService()


@router.post("/chat")
async def chat(
    prompt: Annotated[str, Body(embed=True)],
    conversation_id: Annotated[int, Body(embed=True)],
    database: Annotated[AsyncSession, Depends(get_db)],
    llm_service: Annotated[LLMService, Depends(get_llm_service)],
) -> str:
    return await llm_service.send_message(database, conversation_id, prompt)


@router.post("/conversation")
async def create_conversation(
    database: Annotated[AsyncSession, Depends(get_db)],
    agent_id: int = 1,
    user_id: int = 1,
) -> int:
    conversation = Conversation(agent_id=agent_id, user_id=user_id)
    database.add(conversation)
    await database.commit()
    await database.refresh(conversation)
    return conversation.id
