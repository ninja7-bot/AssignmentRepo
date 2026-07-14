"""
Test Cases for Auth Service.
"""

def test_register_user_returns_token_and_safe_user(client, valid_user_payload):
    response = client.post("/auth/register", json=valid_user_payload)

    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "User registered successfully"
    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == valid_user_payload["email"]
    assert "password" not in data["user"]
    assert "hashed_password" not in data["user"]


def test_register_duplicate_email_is_rejected(client, valid_user_payload):
    assert client.post("/auth/register", json=valid_user_payload).status_code == 201
    response = client.post("/auth/register", json=valid_user_payload)

    assert response.status_code == 409


def test_register_invalid_payloads(client, valid_user_payload):
    invalid_cases = [
        {"email": "not-an-email"},
        {"password": "weakpass"},
        {"phone_number": "+919876543210"},
        {"name": "A"},
    ]
    for change in invalid_cases:
        response = client.post("/auth/register", json={**valid_user_payload, **change})
        assert response.status_code in (400, 422), response.text


def test_login_success(client, valid_user_payload):
    client.post("/auth/register", json=valid_user_payload)
    response = client.post(
        "/auth/login",
        json={"email": valid_user_payload["email"], "password": valid_user_payload["password"]},
    )

    assert response.status_code == 200
    assert response.json()["access_token"]
    assert response.json()["user"]["email"] == valid_user_payload["email"]


def test_login_wrong_password_is_rejected(client, valid_user_payload):
    client.post("/auth/register", json=valid_user_payload)
    response = client.post(
        "/auth/login",
        json={"email": valid_user_payload["email"], "password": "WrongPass1!"},
    )
    assert response.status_code == 401


def test_login_unknown_user_is_rejected(client):
    response = client.post(
        "/auth/login",
        json={"email": "missing@example.com", "password": "StrongPass1!"},
    )
    assert response.status_code == 401


def test_protected_route_requires_valid_token(client):
    assert client.get("/users/me").status_code in (401, 403)
    assert client.get("/users/me", headers={"Authorization": "Bearer invalid"}).status_code == 401


def test_logout_returns_success(client):
    response = client.post("/auth/logout")
    assert response.status_code == 204
