from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any

from app.ai.model_names import ModelName


class Agent(BaseModel):
    id: int = Field(..., description="The id of the agent")
    name: str
    description: str = Field(..., description="The description of the agent")
    created_at: datetime = Field(..., description="The creation date of the agent")
    updated_at: datetime = Field(..., description="The last update date of the agent")


class Conversation(BaseModel):
    id: int
    agent_id: int = Field(..., description="The id of the agent")
    user_id: int = Field(..., description="The id of the user")
    created_at: datetime = Field(..., description="The creation date of the conversation")
    updated_at: datetime = Field(..., description="The last update date of the conversation")


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    content: str = Field(..., description="The content of the message")
    role: str = Field(..., description="The role of the message sender")
    created_at: datetime = Field(..., description="The creation date of the message")

    class Config:
        from_attributes = True


class User(BaseModel):
    id: int = Field(..., description="The id of the user")
    username: str = Field(..., description="The username of the user")
    email: str = Field(..., description="The email of the user")
    created_at: datetime = Field(..., description="The creation date of the user")
    updated_at: datetime = Field(..., description="The last update date of the user")


class AgentConfig(BaseModel):
    id: int
    agent_id: int = Field(..., description="The id of the agent")
    config: dict[str, Any] = Field(..., description="The configuration of the agent")
    created_at: datetime = Field(..., description="The creation date of the agent config")
    updated_at: datetime = Field(..., description="The last update date of the agent config")


class DebateRequest(BaseModel):
    topic: str
    models: list[ModelName]
    rounds: int = Field(default=1, ge=1, description="Number of debate rounds")
    conversation_id: int


class VoteRequest(BaseModel):
    conversation_id: int
    turns: list["DebateTurn"]


class DebateTurn(BaseModel):
    model: str
    content: str
    round: int


class VoteResult(BaseModel):
    votes: list[dict]
    winner: str


class JuryRequest(BaseModel):
    topic: str
    models: list[ModelName]
    rounds: int = Field(default=1, ge=1, description="Number of jury rounds")
    conversation_id: int


class Project(BaseModel):
    id: int
    name: str = Field(..., description="The name of the project")
    description: str = Field(..., description="The description of the project")
    created_at: datetime = Field(..., description="The creation date of the project")
    updated_at: datetime = Field(..., description="The last update date of the project")
    user_id: int = Field(..., description="The id of the user")

    class Config:
        from_attributes = True
