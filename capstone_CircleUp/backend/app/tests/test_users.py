def test_get_current_profile(client, auth_user):
    response = client.get("/users/me", headers=auth_user["headers"])
    assert response.status_code == 200
    assert response.json()["id"] == auth_user["user"]["id"]
    assert response.json()["email"] == auth_user["payload"]["email"]


def test_update_current_profile(client, auth_user):
    response = client.put(
        "/users/me",
        json={"name": "Updated User", "city": "Indore", "bio": "Updated bio."},
        headers=auth_user["headers"],
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated User"
    assert response.json()["city"] == "Indore"


def test_update_profile_rejects_duplicate_email(client, auth_user, second_auth_user):
    response = client.put(
        "/users/me",
        json={"email": second_auth_user["payload"]["email"]},
        headers=auth_user["headers"],
    )
    assert response.status_code == 400


def test_public_profile_hides_contact_information(client, auth_user, second_auth_user):
    response = client.get(
        f"/users/{second_auth_user['user']['id']}", headers=auth_user["headers"]
    )
    assert response.status_code == 200
    data = response.json()
    assert set(data) == {"id", "name", "city", "bio"}
    assert "email" not in data and "phone_number" not in data


def test_get_missing_public_profile_returns_404(client, auth_user):
    response = client.get("/users/999999", headers=auth_user["headers"])
    assert response.status_code == 404


def test_delete_current_account(client, auth_user):
    response = client.delete("/users/me", headers=auth_user["headers"])
    assert response.status_code == 200
    assert response.json() == {"message": "Account deleted successfully"}
    assert client.get("/users/me", headers=auth_user["headers"]).status_code == 401
