from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai.train_model import train_and_save_model
from app.api import ai, alerts, auth, devices, metrics, reports, topology
from app.core.config import get_settings
from app.db.base import *  # noqa: F401,F403
from app.db.session import Base, SessionLocal, engine, wait_for_database
from app.services.ai_service import ai_service
from app.utils.seed import seed_database

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    wait_for_database()
    Base.metadata.create_all(bind=engine)
    train_and_save_model(settings.model_path)
    ai_service.load_model()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.project_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(devices.router, prefix=settings.api_v1_prefix)
app.include_router(alerts.router, prefix=settings.api_v1_prefix)
app.include_router(metrics.router, prefix=settings.api_v1_prefix)
app.include_router(ai.router, prefix=settings.api_v1_prefix)
app.include_router(reports.router, prefix=settings.api_v1_prefix)
app.include_router(topology.router, prefix=settings.api_v1_prefix)


@app.get("/health")
def health_check():
    return {"status": "ok"}
