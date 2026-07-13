"""
Test Cases for Activity CRUD.
"""

from datetime import datetime, timedelta, timezone


def test_create_activity(client, auth_user, activity_payload):
    response = client.post("/activities/", json=activity_payload, headers=auth_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == activity_payload["title"]
    assert data["creator_id"] == auth_user["user"]["id"]
    assert data["creator_name"] == auth_user["user"]["name"]
    assert data["current_participants"] == 0
    assert data["status"] == "open"


def test_create_activity_requires_authentication(client, activity_payload):
    assert client.post("/activities/", json=activity_payload).status_code in (401, 403)


def test_create_activity_rejects_past_date(client, auth_user, activity_payload):
    payload = {**activity_payload, "activity_date": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()}
    assert client.post("/activities/", json=payload, headers=auth_user["headers"]).status_code == 422


def test_list_and_get_activity(client, create_activity):
    created = create_activity()
    listing = client.get("/activities/")
    detail = client.get(f"/activities/{created['id']}")
    assert listing.status_code == 200
    assert any(item["id"] == created["id"] for item in listing.json())
    assert detail.status_code == 200
    assert detail.json()["id"] == created["id"]


def test_list_activities_supports_category_and_location_filters(client, create_activity):
    create_activity(title="Football Meetup", category="sports", location="Bhopal")
    create_activity(title="Movie Evening", category="entertainment", location="Indore")
    response = client.get("/activities/", params={"category": "sports", "location": "Bhopal"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Football Meetup"


def test_list_activities_rejects_invalid_sort_parameters(client):
    assert client.get("/activities/", params={"sort_by": "unknown"}).status_code == 422
    assert client.get("/activities/", params={"sort_order": "sideways"}).status_code == 422


def test_list_my_activities_only_returns_owned_activities(client, auth_user, second_auth_user, create_activity):
    mine = create_activity(title="My Activity")
    create_activity(headers=second_auth_user["headers"], title="Other Activity")
    response = client.get("/activities/mine", headers=auth_user["headers"])
    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [mine["id"]]


def test_update_activity_by_owner(client, auth_user, create_activity):
    activity = create_activity()
    response = client.put(
        f"/activities/{activity['id']}", json={"title": "Updated Football"}, headers=auth_user["headers"]
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Football"


def test_non_owner_cannot_update_or_cancel(client, second_auth_user, create_activity):
    activity = create_activity()
    update = client.put(f"/activities/{activity['id']}", json={"title": "Hijacked Title"}, headers=second_auth_user["headers"])
    cancel = client.delete(f"/activities/{activity['id']}", headers=second_auth_user["headers"])
    assert update.status_code == 403
    assert cancel.status_code == 403


def test_cancel_activity_by_owner(client, auth_user, create_activity):
    activity = create_activity()
    response = client.delete(f"/activities/{activity['id']}", headers=auth_user["headers"])
    assert response.status_code == 200
    detail = client.get(f"/activities/{activity['id']}")
    assert detail.json()["status"] == "cancelled"


def test_missing_activity_returns_404(client, auth_user):
    assert client.get("/activities/999999").status_code == 404
    assert client.put("/activities/999999", json={"title": "Missing Activity"}, headers=auth_user["headers"]).status_code == 404
