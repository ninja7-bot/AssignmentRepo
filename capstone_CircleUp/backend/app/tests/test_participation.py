def request_join(client, activity_id, headers):
    return client.post("/participation/request", json={"activity_id": activity_id}, headers=headers)


def test_user_can_request_to_join_activity(client, second_auth_user, create_activity):
    activity = create_activity()
    response = request_join(client, activity["id"], second_auth_user["headers"])
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


def test_creator_cannot_join_own_activity(client, auth_user, create_activity):
    activity = create_activity()
    response = request_join(client, activity["id"], auth_user["headers"])
    assert response.status_code == 400


def test_duplicate_join_request_is_rejected(client, second_auth_user, create_activity):
    activity = create_activity()
    assert request_join(client, activity["id"], second_auth_user["headers"]).status_code == 200
    assert request_join(client, activity["id"], second_auth_user["headers"]).status_code == 400


def test_request_for_missing_activity_returns_404(client, second_auth_user):
    assert request_join(client, 999999, second_auth_user["headers"]).status_code == 404


def test_owner_can_view_and_approve_pending_request(client, auth_user, second_auth_user, create_activity):
    activity = create_activity()
    request = request_join(client, activity["id"], second_auth_user["headers"]).json()
    pending = client.get(f"/participation/activity/{activity['id']}/requests", headers=auth_user["headers"])
    assert pending.status_code == 200
    assert pending.json()[0]["user_name"] == second_auth_user["user"]["name"]

    approved = client.post(f"/participation/approve/{request['id']}", headers=auth_user["headers"])
    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"


def test_owner_can_reject_pending_request(client, auth_user, second_auth_user, create_activity):
    activity = create_activity()
    request = request_join(client, activity["id"], second_auth_user["headers"]).json()
    response = client.post(f"/participation/reject/{request['id']}", headers=auth_user["headers"])
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"


def test_non_owner_cannot_manage_requests(client, second_auth_user, register_user, create_activity):
    third_data, _ = register_user(name="Third User", email="third@example.com", phone_number="9876543212")
    third_headers = {"Authorization": f"Bearer {third_data['access_token']}"}
    activity = create_activity()
    request = request_join(client, activity["id"], second_auth_user["headers"]).json()
    assert client.post(f"/participation/approve/{request['id']}", headers=third_headers).status_code == 403
    assert client.get(f"/participation/activity/{activity['id']}/requests", headers=third_headers).status_code == 403


def test_my_requests_only_returns_current_users_requests(client, second_auth_user, create_activity):
    activity = create_activity()
    request_join(client, activity["id"], second_auth_user["headers"])
    response = client.get("/participation/my-requests", headers=second_auth_user["headers"])
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["activity_id"] == activity["id"]


def test_approved_participant_increases_activity_count(client, auth_user, second_auth_user, create_activity):
    activity = create_activity()
    request = request_join(client, activity["id"], second_auth_user["headers"]).json()
    client.post(f"/participation/approve/{request['id']}", headers=auth_user["headers"])
    detail = client.get(f"/activities/{activity['id']}")
    assert detail.status_code == 200
    assert detail.json()["current_participants"] == 1


def test_cannot_approve_same_request_twice(client, auth_user, second_auth_user, create_activity):
    activity = create_activity()
    request = request_join(client, activity["id"], second_auth_user["headers"]).json()
    assert client.post(f"/participation/approve/{request['id']}", headers=auth_user["headers"]).status_code == 200
    assert client.post(f"/participation/approve/{request['id']}", headers=auth_user["headers"]).status_code == 400
