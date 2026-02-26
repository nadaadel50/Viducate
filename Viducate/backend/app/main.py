from fastapi import FastAPI
from app.api.v1.endpoints.auth import router as auth_router

app = FastAPI(
    title="Viducate API",
    description="Backend API for Viducate learning platform",
    version="1.0.0"
)

# Register routers
app.include_router(auth_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {"status": "Viducate API is running"}
