import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client():
    """Create a FastAPI test client instance for integration tests."""
    with TestClient(app) as test_client:
        yield test_client
