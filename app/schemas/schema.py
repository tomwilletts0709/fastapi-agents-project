from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any

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

class Message(BaseModel):
    id: int
    conversation_id: int
    content: str = Field(..., description="The content of the message")
    created_at: datetime = Field(..., description="The creation date of the message")
    updated_at: datetime = Field(..., description="The last update date of the message")

class User(BaseModel): 
    id: int = Field(..., description="The id of the user")
    name: str = Field(..., description="The name of the user")
    email: str = Field(..., description="The email of the user")
    created_at: datetime = Field(..., description="The creation date of the user")
    updated_at: datetime = Field(..., description="The last update date of the user")

class AgentConfig(BaseModel):
    id: int
    agent_id: int = Field(..., description="The id of the agent")
    config: dict[str, Any] = Field(..., description="The configuration of the agent")
    created_at: datetime = Field(..., description="The creation date of the agent config")
    updated_at: datetime = Field(..., description="The last update date of the agent config")

class Project(BaseModel): 
    id: int
    name: str = Field(..., description="The name of the project")
    description: str = Field(..., description="The description of the project")
    created_at: datetime = Field(..., description="The creation date of the project")
    updated_at: datetime = Field(..., description="The last update date of the project")
    user_id: int = Field(..., description="The id of the user")

    