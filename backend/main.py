from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import routers
from routers import auth, dashboard, live, batch, model, incidents, profile

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aegis IDS Backend", version="1.0.0")

# CORS - allow frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(live.router, prefix="/live", tags=["live"])
app.include_router(batch.router, prefix="/batch", tags=["batch"])
app.include_router(model.router, prefix="/model", tags=["model"])
app.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])

@app.get("/health")
async def health():
    return {"status": "ok"}