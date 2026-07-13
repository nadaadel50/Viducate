from fastapi import FastAPI
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.video import router as video_router
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import secrets
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.ocr import router as ocr_router
from app.api.v1.endpoints.segments import router as segments_router 
from app.api.v1.endpoints.semantic_search import router as search_router 
from app.api.v1.endpoints.summary import router as summary_router 
from app.api.v1.endpoints.slidesExtraction import router as slides_router 
from app.api.v1.endpoints.preferences import router as preferences_router
from app.api.v1.endpoints.flashcards import router as flashcards_router
from app.api.v1.endpoints.quiz import router as quiz_router
from app.api.v1.endpoints.chat import router as chat_router
from app.api.v1.endpoints.mindmap import router as mindmap_router
from app.api.v1.endpoints.studynotes import router as studynotes_router
from app.api.v1.endpoints.export import router as export_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.profile import router as profile_router
from app.api.v1.endpoints.report import router as report_router


import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
app = FastAPI(
    title="Viducate API",
    description="Backend API for Viducate learning platform",
    version="1.0.0"
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY or secrets.token_urlsafe(32)
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(video_router, prefix="/api/v1")

app.include_router(ocr_router, prefix="/api/v1") 
app.include_router(segments_router, prefix="/api/v1") 


app.include_router(search_router, prefix="/api/v1")
app.include_router(summary_router, prefix="/api/v1")
app.include_router(slides_router, prefix="/api/v1")
app.include_router(preferences_router, prefix="/api/v1")
app.include_router(flashcards_router, prefix="/api/v1")
app.include_router(quiz_router, prefix="/api/v1")

app.include_router(chat_router, prefix="/api/v1")
app.include_router(mindmap_router, prefix="/api/v1")  
app.include_router(studynotes_router, prefix="/api/v1")
app.include_router(export_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(profile_router, prefix="/api/v1")
app.include_router(report_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {"status": "Viducate API is running"}

# uvicorn app.main:app --reload