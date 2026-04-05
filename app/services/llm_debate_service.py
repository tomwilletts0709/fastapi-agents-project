from pydantic import BaseModel
from pydantic_ai import Agent, ModelRequest, ModelResponse, TextPart, UserPromptPart
from app.core.errors import NoAgentWinnerVotesError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Message


class DebateTurn(BaseModel):
    model: str
    content: str
    round: int

class JuryTurn(BaseModel):
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
        round_num: int,
        round_turns: list[DebateTurn],
    ) -> list[dict]:
        """Each model votes on the best argument from other participants in each round.
        Each agent has one vote per round and cannot vote for itself."""
        votes: list[dict] = []
        round_numbers = sorted({t.round for t in round_turns})

        for r in round_numbers:
            current_round_turns = [t for t in round_turns if t.round == r]

            for agent, voter_name in zip(self.agents, self.model_names):
                others = [t for t in current_round_turns if t.model != voter_name]

                prompt = (
                    f"You are voting on the best argument in debate round {r}.\n"
                    "Review the following arguments from other participants:\n"
                )
                for t in others:
                    prompt += f"\n[{t.model.upper()}]: {t.content}\n"
                prompt += (
                    "\nWhich participant made the strongest argument? "
                    "Reply with just the model name, exactly as shown in brackets above."
                )

                results = await agent.run(prompt)
                choice = results.output.strip()

                votes.append({
                    "voter": voter_name,
                    "choice": choice,
                    "others": [t.model for t in others],
                })

                session.add(Message(
                    conversation_id=conversation_id,
                    content=f"[{voter_name.upper()}] votes for: {choice}",
                    role="assistant",
                ))
            await session.commit()

        if not votes:
            raise NoAgentWinnerVotesError()
        return votes

    async def jury_service(
        self,
        session: AsyncSession,
        conversation_id: int,
        topic: str,
        rounds: int = 1,
    ) -> list[JuryTurn]:
        """Models act as a jury, each deliberating on the topic and building on each other's
        reasoning to arrive at a collective verdict."""
        turns: list[JuryTurn] = []
        history: list[ModelRequest | ModelResponse] = []

        jury_prompt = (
            f"You are serving as a juror deliberating on the following topic: {topic}\n"
            "Assess the arguments carefully and give your reasoned verdict. Be concise but substantive. "
            "If other jurors have already spoken, you may reference and respond to their reasoning."
        )

        session.add(Message(
            conversation_id=conversation_id,
            content=topic,
            role="user",
        ))
        await session.commit()

        for current_round in range(1, rounds + 1):
            for agent, model_name in zip(self.agents, self.model_names):
                prompt = jury_prompt
                if history:
                    prompt += "\n\nDeliberation so far:\n"
                    for turn in turns:
                        prompt += f"\n[{turn.model.upper()}] {turn.content}\n"

                results = await agent.run(prompt, message_history=history)
                response_text = results.output

                history.append(ModelRequest(parts=[UserPromptPart(content=prompt)]))
                history.append(ModelResponse(parts=[TextPart(content=response_text)]))

                session.add(Message(
                    conversation_id=conversation_id,
                    content=f"[{model_name.upper()}] {response_text}",
                    role="assistant",
                ))
                await session.commit()

                turns.append(JuryTurn(
                    model=model_name,
                    content=response_text,
                    round=current_round,
                ))

        return turns
