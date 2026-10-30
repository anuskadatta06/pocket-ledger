def test_read_root(client):
    """Test the root endpoint returns 200 and expected metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "PocketLedger API"
    assert data["status"] == "online"
    assert "version" in data


def test_health_check(client):
    """Test the health check endpoint returns 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "environment" in data


def test_process_time_header(client):
    """Test that custom logging middleware appends X-Process-Time-Ms header."""
    response = client.get("/health")
    assert response.status_code == 200
    assert "x-process-time-ms" in response.headers


def test_not_found_endpoint(client):
    """Test that visiting an unknown path returns 404."""
    response = client.get("/api/v1/nonexistent")
    assert response.status_code == 404
