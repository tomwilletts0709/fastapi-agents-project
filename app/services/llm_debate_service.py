from pydantic import BaseModel
from pydantic_ai import Agent, ModelRequest, ModelResponse, TextPart, UserPromptPart
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Message


class DebateTurn(BaseModel):
    model: str
    content: str
    round: int


class LLMDebateService:
    """Orchestrates a multi-agent debate where agents take turns responding.

    Each agent sees the full conversation history so far (the topic + all
    prior responses from other agents) when producing its turn.
    """

    def __init__(self, agents: list[Agent], model_names: list[str]):
        self.agents = agents
        self.model_names = model_names

    async def debate(
        self,
        session: AsyncSession,
        conversation_id: int,
        topic: str,
        rounds: int = 1,
    ) -> list[DebateTurn]:
        turns: list[DebateTurn] = []
        history: list[ModelRequest | ModelResponse] = []

        debate_prompt = (
            f"You are in a structured debate. The topic is: {topic}\n"
            "Respond with your position. Be concise but substantive. "
            "If other participants have already spoken, you may reference and respond to their arguments."
        )

        session.add(Message(
            conversation_id=conversation_id,
            content=topic,
            role="user",
        ))
        await session.commit()

        for current_round in range(1, rounds + 1):
            for agent, model_name in zip(self.agents, self.model_names):
                prompt = debate_prompt
                if history:
                    prompt += "\n\nDebate so far:\n"
                    for turn in turns:
                        prompt += f"\n[{turn.model.upper()}]: {turn.content}\n"

                result = await agent.run(prompt, message_history=history)
                response_text = result.output

                history.append(ModelRequest(parts=[UserPromptPart(content=prompt)]))
                history.append(ModelResponse(parts=[TextPart(content=response_text)]))

                session.add(Message(
                    conversation_id=conversation_id,
                    content=f"[{model_name.upper()}] {response_text}",
                    role="assistant",
                ))
                await session.commit()

                turns.append(DebateTurn(
                    model=model_name,
                    content=response_text,
                    round=current_round,
                ))

        return turns
        
        async def model_vote(
            self, 
            session: AsyncSession,
            conversation_id: int,
            turn: DebateTurn,
        ) -> str: 
            """This functions enables the model to vote on the best response.
            It will be used to select the best response from the list of responses 
            and each agent has one vote."""
            prompt = f"Vote on the best response from the following list: {turn.content}"
            result = await self.agent.run(prompt)
            return result.output