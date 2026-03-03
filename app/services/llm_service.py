from app.models.repository import Repository
from app.schemas.schema import Agent, Conversation, Message, User, AgentConfig
from app.core.errors import NotFoundError, BadRequestError, InternalServerError
from pydantic_ai import LLM

class llmservice(): 
    def __init__(self, model: str): 
        self.model = model
        self.repository = Repository()


    async def send_message(self, conversation_id: int, message: str) -> str: 
        messages = await self.load_chat_history(conversation_id)
        result = await self.call_llm(messages + [{"role": "user", "content": message}])
        await self.create_chat_history(conversation_id, message, result)
        return result
    
    async def load_chat_history(self, conversation_id: int) -> list[dict[str, str]]:
        conversation = await self.repository.get_by_id(Conversation, conversation_id)
        if conversation is None:
            raise NotFoundError("Conversation not found")
        return conversation.messages
   