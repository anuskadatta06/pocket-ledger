from datetime import date


def test_create_and_read_transaction(client):
    """Test creating a transaction and retrieving it."""
    # Create category first
    cat_res = client.post(
        "/api/v1/categories",
        json={"name": "TxCatTest", "icon": "tag", "color": "#123123"},
    )
    cat_id = cat_res.json()["id"]

    tx_payload = {
        "title": "Lunch Sandwich",
        "amount": 12.50,
        "type": "expense",
        "date": str(date.today()),
        "notes": "Quick lunch",
        "category_id": cat_id,
    }
    create_res = client.post("/api/v1/transactions", json=tx_payload)
    assert create_res.status_code == 201
    tx_data = create_res.json()
    tx_id = tx_data["id"]
    assert tx_data["title"] == "Lunch Sandwich"
    assert tx_data["amount"] == 12.50

    # Get single transaction
    get_res = client.get(f"/api/v1/transactions/{tx_id}")
    assert get_res.status_code == 200
    assert get_res.json()["category"]["name"] == "TxCatTest"


def test_transaction_validation_errors(client):
    """Test amount <= 0 and missing category validation."""
    # Invalid amount
    res = client.post(
        "/api/v1/transactions",
        json={"title": "Negative", "amount": -10.0, "category_id": 1},
    )
    assert res.status_code == 422

    # Non-existent category
    res = client.post(
        "/api/v1/transactions",
        json={"title": "Ghost Cat", "amount": 25.0, "category_id": 999999},
    )
    assert res.status_code == 404


def test_patch_and_delete_transaction(client):
    """Test partial patch update and deletion."""
    cat_res = client.post(
        "/api/v1/categories",
        json={"name": "PatchCat", "icon": "tag", "color": "#444444"},
    )
    cat_id = cat_res.json()["id"]

    tx_res = client.post(
        "/api/v1/transactions",
        json={"title": "Old Title", "amount": 20.0, "category_id": cat_id},
    )
    tx_id = tx_res.json()["id"]

    # Patch title
    patch_res = client.patch(
        f"/api/v1/transactions/{tx_id}",
        json={"title": "New Patched Title"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["title"] == "New Patched Title"

    # Delete
    del_res = client.delete(f"/api/v1/transactions/{tx_id}")
    assert del_res.status_code == 204
