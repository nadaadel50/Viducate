from fastapi import FastAPI
from app.api.v1.endpoints.auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware
import secrets
from app.config import settings

app = FastAPI(
    title="Viducate API",
    description="Backend API for Viducate learning platform",
    version="1.0.0"
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY or secrets.token_urlsafe(32)
)



#app.add_middleware(
#    CORSMiddleware,
#   allow_origins=["http://localhost:5173"],  # React/Vite
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
#)

# Register routers
app.include_router(auth_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {"status": "Viducate API is running"}

# uvicorn app.main:app --reload