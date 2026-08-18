def test_list_todos_starts_empty(client):
    response = client.get("/api/todos")
    assert response.status_code == 200
    assert response.json() == []


def test_create_then_list(client):
    created = client.post("/api/todos", json={"title": "Buy milk"})
    assert created.status_code == 201
    body = created.json()
    assert body["title"] == "Buy milk"
    assert body["done"] is False
    assert "id" in body and "created_at" in body

    listed = client.get("/api/todos")
    assert listed.status_code == 200
    assert [t["title"] for t in listed.json()] == ["Buy milk"]


def test_get_single_todo(client):
    created = client.post("/api/todos", json={"title": "Walk dog"}).json()
    response = client.get(f"/api/todos/{created['id']}")
    assert response.status_code == 200
    assert response.json()["title"] == "Walk dog"


def test_get_missing_todo_is_404(client):
    assert client.get("/api/todos/999").status_code == 404


def test_update_todo(client):
    created = client.post("/api/todos", json={"title": "Draft"}).json()
    response = client.patch(f"/api/todos/{created['id']}", json={"done": True})
    assert response.status_code == 200
    assert response.json()["done"] is True
    assert response.json()["title"] == "Draft"


def test_update_missing_todo_is_404(client):
    assert client.patch("/api/todos/999", json={"done": True}).status_code == 404


def test_delete_todo(client):
    created = client.post("/api/todos", json={"title": "Temporary"}).json()
    response = client.delete(f"/api/todos/{created['id']}")
    assert response.status_code == 204
    assert client.get(f"/api/todos/{created['id']}").status_code == 404


def test_delete_missing_todo_is_404(client):
    assert client.delete("/api/todos/999").status_code == 404
