def test_create_and_get_category(client):
    """Test creating a new category and reading it back."""
    payload = {
        "name": "Investments",
        "icon": "trending-up",
        "color": "#10B981",
        "description": "Stock market and index funds",
    }
    create_res = client.post("/api/v1/categories", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    cat_id = created_data["id"]
    assert created_data["name"] == "Investments"
    assert created_data["is_system"] is False

    get_res = client.get(f"/api/v1/categories/{cat_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Investments"


def test_duplicate_category_validation(client):
    """Test creating a category with duplicate name returns 400."""
    payload = {"name": "UniqueCategory", "icon": "tag", "color": "#000000"}
    res1 = client.post("/api/v1/categories", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/categories", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_update_category(client):
    """Test updating category details."""
    payload = {"name": "ToUpdate", "icon": "tag", "color": "#111111"}
    create_res = client.post("/api/v1/categories", json=payload)
    cat_id = create_res.json()["id"]

    update_res = client.put(f"/api/v1/categories/{cat_id}", json={"color": "#222222"})
    assert update_res.status_code == 200
    assert update_res.json()["color"] == "#222222"


def test_delete_category(client):
    """Test deleting custom category."""
    payload = {"name": "ToDelete", "icon": "tag", "color": "#333333"}
    create_res = client.post("/api/v1/categories", json=payload)
    cat_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/categories/{cat_id}")
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/v1/categories/{cat_id}")
    assert get_res.status_code == 404
