from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn  
from dotenv import load_dotenv
from app.api import router
from app.ai.agents import chat_agent  # noqa: F401 - for future use
from app.core.settings import Settings

settings = Settings()

app = FastAPI() 

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

