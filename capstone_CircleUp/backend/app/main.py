"""
main.py responsible for initializing the FastAPI application, setting up middleware, and including routers for 
authentication and user management. It also creates the necessary database tables on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, activity
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CircleUp API",
    description="A platform for discovering and organizing social activities",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(activity.router)
app.include_router(participation.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CircleUp API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}