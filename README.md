# Chat Agent API

A FastAPI chat agent backend powered by [Pydantic AI](https://ai.pydantic.dev/), with support for multi-agent conversations, message history, and SQLite persistence.

## Tech Stack

- **API**: FastAPI
- **AI**: Pydantic AI (Anthropic Claude)
- **Database**: SQLAlchemy (async) + SQLite
- **Validation**: Pydantic

## Project Structure

```
app/
├── ai/           # Pydantic AI agent definitions
├── api/          # FastAPI routes
├── core/         # Shared utilities, errors, middleware
├── models/       # SQLAlchemy models, db config, repository
├── schemas/      # Pydantic request/response schemas
├── services/     # Business logic (e.g. LLM / chat service)
└── main.py       # Application entrypoint
```

## Setup

### Prerequisites

- Python 3.10+
- [Anthropic API key](https://console.anthropic.com/) (for Pydantic AI / Claude)

### Installation

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```
# Optional: override DB URL (defaults to sqlite:///./sql_app.db)
DATABASE_URL=sqlite:///./sql_app.db

# Required for Pydantic AI / Anthropic
ANTHROPIC_API_KEY=your_api_key_here
```

## Running the App

```bash
# Development server (reload on changes)
python -m app.main

# Or with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

- **Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

| Method | Path     | Description        |
|--------|----------|--------------------|
| POST   | `/agents`| Create a new agent |

## Domain Models

- **Agent** – AI agent configuration (name, description)
- **Conversation** – Chat thread between a user and an agent
- **Message** – Individual messages within a conversation
- **User** – User account
- **AgentConfig** – Per-agent runtime configuration

## Development

### Running Tests

```bash
# From project root
pytest tests/
```

### Database

SQLite is used by default. The database file is created at `./sql_app.db` on first run.

To use PostgreSQL or another backend, set `DATABASE_URL` in `.env` and ensure the URL matches SQLAlchemy’s async format for your driver.

## License

MIT
