from app.services.llm_debate_service import LLMDebateService
from app.core.errors import NoAgentWinnerVotesError

def test_model_vote():
    service = LLMDebateService(agents=[], model_names=[])
    with pytest.raises(NoAgentWinnerVotesError):
        await service.model_vote(session=None, conversation_id=None, round_num=None, round_turns=[])