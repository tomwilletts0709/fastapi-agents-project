from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents import AGENTS
from app.ai.model_names import ModelName
from app.models.db import get_db
from app.models.models import Conversation, Message
from app.schemas.schema import (
    DebateRequest,
    DebateTurn,
    JuryRequest,
    JuryTurn,
    MessageResponse,
    Project,
    VoteRequest,
    VoteResult,
)
from app.services.llm_service import LLMService
from app.services.llm_debate_service import LLMDebateService, JuryTurn as ServiceJuryTurn
from app.services.project_service import ProjectService

router = APIRouter()


def get_llm_service() -> LLMService:
    return LLMService()


def get_project_service() -> ProjectService:
    return ProjectService()


@router.get("/models")
async def list_models() -> list[str]:
    return [m.value for m in ModelName]


@router.post("/chat")
async def chat(
    prompt: Annotated[str, Body(embed=True)],
    conversation_id: Annotated[int, Body(embed=True)],
    database: Annotated[AsyncSession, Depends(get_db)],
    llm_service: Annotated[LLMService, Depends(get_llm_service)],
    model: Annotated[ModelName | None, Body(embed=True)] = None,
) -> str:
    agent = AGENTS[model] if model else None
    return await llm_service.send_message(database, conversation_id, prompt, agent=agent)


@router.post("/debate")
async def debate(
    body: DebateRequest,
    database: Annotated[AsyncSession, Depends(get_db)],
) -> list[DebateTurn]:
    if len(body.models) < 2:
        raise HTTPException(status_code=400, detail="Debate requires at least 2 models")

    agents = [AGENTS[m] for m in body.models]
    service = LLMDebateService(agents=agents, model_names=[m.value for m in body.models])
    return await service.debate(
        session=database,
        conversation_id=body.conversation_id,
        topic=body.topic,
        rounds=body.rounds,
    )


@router.post("/debate/vote", response_model=VoteResult)
async def vote(
    body: VoteRequest,
    database: Annotated[AsyncSession, Depends(get_db)],
) -> VoteResult:
    """Have each model vote on the strongest argument from a completed debate."""
    if not body.turns:
        raise HTTPException(status_code=400, detail="No debate turns provided to vote on")

    model_names = list({t.model for t in body.turns})
    agents = []
    for name in model_names:
        try:
            agents.append(AGENTS[ModelName(name)])
        except (ValueError, KeyError):
            raise HTTPException(status_code=400, detail=f"Unknown model: {name}")

    from app.services.llm_debate_service import DebateTurn as ServiceDebateTurn
    service_turns = [
        ServiceDebateTurn(model=t.model, content=t.content, round=t.round)
        for t in body.turns
    ]

    service = LLMDebateService(agents=agents, model_names=model_names)
    votes = await service.model_vote(
        session=database,
        conversation_id=body.conversation_id,
        round_num=0,
        round_turns=service_turns,
    )
    winner = service.tally_votes(votes)
    return VoteResult(votes=votes, winner=winner)


@router.post("/debate/jury")
async def jury(
    body: JuryRequest,
    database: Annotated[AsyncSession, Depends(get_db)],
) -> list[ServiceJuryTurn]:
    """Run a jury deliberation where models collectively reason toward a verdict."""
    if len(body.models) < 2:
        raise HTTPException(status_code=400, detail="Jury requires at least 2 models")

    agents = [AGENTS[m] for m in body.models]
    service = LLMDebateService(agents=agents, model_names=[m.value for m in body.models])
    return await service.jury_service(
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


@router.get("/conversation/{conversation_id}/messages", response_model=list[MessageResponse])
async def get_conversation_messages(
    conversation_id: int,
    database: Annotated[AsyncSession, Depends(get_db)],
) -> list[MessageResponse]:
    """Retrieve all messages for a conversation in chronological order."""
    stmt = select(Conversation).where(Conversation.id == conversation_id)
    result = await database.execute(stmt)
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")

    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    result = await database.execute(stmt)
    return result.scalars().all()


@router.post("/project")
async def create_project(
    database: Annotated[AsyncSession, Depends(get_db)],
    project_service: Annotated[ProjectService, Depends(get_project_service)],
    project_name: str = Body(..., description="The name of the project"),
    project_description: str = Body(..., description="The description of the project"),
    user_id: int = Body(..., description="The id of the user"),
) -> int:
    return await project_service.create_project(database, project_name, project_description, user_id)


@router.get("/project/{project_id}", response_model=Project)
async def get_project(
    project_id: int,
    user_id: int,
    database: Annotated[AsyncSession, Depends(get_db)],
    project_service: Annotated[ProjectService, Depends(get_project_service)],
) -> Project:
    project = await project_service.get_project(database, user_id, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return project


@router.get("/project", response_model=list[Project])
async def list_projects(
    user_id: int,
    database: Annotated[AsyncSession, Depends(get_db)],
    project_service: Annotated[ProjectService, Depends(get_project_service)],
) -> list[Project]:
    return await project_service.list_projects(database, user_id)
