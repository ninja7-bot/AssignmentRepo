"""
Main Driver App File for CircleUp.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, activity, participation, metadata
from .database import engine, Base
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("circleup")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CircleUp API",
    description="A platform for discovering and organizing social activities",
    version="1.0.0"
)

logger.info("CircleUp Started.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(activity.router)
app.include_router(participation.router)
app.include_router(metadata.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Root API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}