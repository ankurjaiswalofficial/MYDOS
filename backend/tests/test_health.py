from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_is_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_the_openapi_schema_is_generated():
    """A route with an unserializable response model breaks here and nowhere
    else — the endpoint itself keeps working until a client reads the schema."""
    assert client.get("/openapi.json").status_code == 200
