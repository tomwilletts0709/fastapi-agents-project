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

**Using uv (recommended):**

```bash
# Install uv: https://docs.astral.sh/uv/
uv sync
```

**Using pip:**

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .
```

### Environment Variables

Create a `.env` file in the project root:

```
# Optional: override DB URL (defaults to sqlite:///./sql_app.db)
DATABASE_URL=

# Required for Pydantic AI / Anthropic
ANTHROPIC_API_KEY=your_api_key_here
```

## Running the App

```bash
# With uv
uv run python -m app.main
# or
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# With pip/venv
python -m app.main
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

- **Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Frontend

A Next.js TypeScript frontend now lives in `frontend/` and is designed for Vercel deployment.

### Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Set the backend URL in `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run the frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Run backend + frontend (local end-to-end)

1. **Terminal 1** – backend:
   ```bash
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Terminal 2** – frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000), start a new conversation, and send a message. The frontend talks to the API at `http://localhost:8000`.

### Deploy to Vercel

1. Import the repository into Vercel.
2. Set the project root to `frontend/`.
3. Add `NEXT_PUBLIC_API_URL` in the Vercel environment variables, pointing to your deployed FastAPI backend.

## API Endpoints

| Method | Path     | Description        |
|--------|----------|--------------------|
| POST   | `/conversation` | Create a conversation and return its ID |
| POST   | `/chat` | Send a message to the active conversation |

## Domain Models

- **Agent** – AI agent configuration (name, description)
- **Conversation** – Chat thread between a user and an agent
- **Message** – Individual messages within a conversation
- **User** – User account
- **AgentConfig** – Per-agent runtime configuration

## Development

### Running Tests

```bash
# With uv (includes dev deps)
uv run pytest tests/

# With pip
pytest tests/
```

### Database

Postgres is used by default. 


## License

MIT
