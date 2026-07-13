from datetime import datetime, timedelta, timezone
import os

os.environ["DATABASE_URL"] = "sqlite:///./test_bootstrap.db"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

TEST_DATABASE_URL = "sqlite://"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def valid_user_payload():
    return {
        "name": "Test User",
        "email": "test@example.com",
        "password": "StrongPass1!",
        "phone_number": "9876543210",
        "city": "Bhopal",
        "bio": "I enjoy meeting new people.",
    }


@pytest.fixture
def register_user(client):
    created = []

    def _register(**overrides):
        index = len(created) + 1
        payload = {
            "name": "Test User",
            "email": f"user{index}@example.com",
            "password": "StrongPass1!",
            "phone_number": f"98765432{index:02d}",
            "city": "Bhopal",
            "bio": "Test user bio.",
        }
        payload.update(overrides)
        response = client.post("/auth/register", json=payload)
        assert response.status_code == 200, response.text
        created.append(response.json())
        return response.json(), payload

    return _register


@pytest.fixture
def auth_user(register_user):
    data, payload = register_user()
    return {
        "user": data["user"],
        "payload": payload,
        "token": data["access_token"],
        "headers": {"Authorization": f"Bearer {data['access_token']}"},
    }


@pytest.fixture
def second_auth_user(register_user):
    data, payload = register_user(
        name="Second User",
        email="second@example.com",
        phone_number="9876543211",
    )
    return {
        "user": data["user"],
        "payload": payload,
        "token": data["access_token"],
        "headers": {"Authorization": f"Bearer {data['access_token']}"},
    }


@pytest.fixture
def future_date():
    return datetime.now(timezone.utc) + timedelta(days=7)


@pytest.fixture
def activity_payload(future_date):
    return {
        "title": "Weekend Football",
        "description": "A friendly football match for local players.",
        "category": "sports",
        "location": "Bhopal Sports Ground",
        "activity_date": future_date.isoformat(),
        "max_participants": 5,
    }


@pytest.fixture
def create_activity(client, auth_user, activity_payload):
    def _create(headers=None, **overrides):
        payload = {**activity_payload, **overrides}
        response = client.post(
            "/activities/",
            json=payload,
            headers=headers or auth_user["headers"],
        )
        assert response.status_code == 200, response.text
        return response.json()

    return _create
