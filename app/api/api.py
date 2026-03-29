from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents import AGENTS
from app.models.db import get_db
from app.models.models import Conversation
from app.services.llm_service import LLMService
from app.services.llm_debate_service import LLMDebateService

router = APIRouter()


def get_llm_service() -> LLMService:
    return LLMService()


@router.get("/models")
async def list_models() -> list[str]:
    return list(AGENTS.keys())


@router.post("/chat")
async def chat(
    prompt: Annotated[str, Body(embed=True)],
    conversation_id: Annotated[int, Body(embed=True)],
    database: Annotated[AsyncSession, Depends(get_db)],
    llm_service: Annotated[LLMService, Depends(get_llm_service)],
    model: Annotated[str | None, Body(embed=True)] = None,
) -> str:
    if model and model not in AGENTS:
        raise HTTPException(status_code=400, detail=f"Unknown model: {model}")
    agent = AGENTS[model] if model else None
    return await llm_service.send_message(database, conversation_id, prompt, agent=agent)


@router.post("/debate")
async def debate(
    body: DebateRequest,
    database: Annotated[AsyncSession, Depends(get_db)],
) -> list[DebateTurn]:
    for m in body.models:
        if m not in AGENTS:
            raise HTTPException(status_code=400, detail=f"Unknown model: {m}")
    if len(body.models) < 2:
        raise HTTPException(status_code=400, detail="Debate requires at least 2 models")

    agents = [AGENTS[m] for m in body.models]
    service = LLMDebateService(agents=agents, model_names=body.models)
    return await service.debate(
        session=database,
        conversation_id=body.conversation_id,
        topic=body.topic,
        rounds=body.rounds,
    )


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


@router.post("/project")
async def create_project(
    database: Annotated[AsyncSession, Depends(get_db)],
    llm_service: Annotated[LLMService, Depends(get_llm_service)],
    project_name: str = Body(..., description="The name of the project"),
    project_description: str = Body(..., description="The description of the project"),
    user_id: int = Body(..., description="The id of the user"),
) -> int:
    return await llm_service.create_project(database, project_name, project_description, user_id)
