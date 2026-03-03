from fastapi import APIRouter

from app.schemas.schema import Agent

router = APIRouter()


@router.post("/agents")
async def create_agent(agent_in: Agent):
    return