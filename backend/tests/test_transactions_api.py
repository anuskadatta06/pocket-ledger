from datetime import date, timedelta


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


def test_transaction_filters_and_search(client):
    """Test search keyword and category/type filtering."""
    cat_res = client.post(
        "/api/v1/categories",
        json={"name": "FilterCat", "icon": "tag", "color": "#555555"},
    )
    cat_id = cat_res.json()["id"]

    client.post(
        "/api/v1/transactions",
        json={"title": "Special Apple Pie", "amount": 15.0, "type": "expense", "category_id": cat_id},
    )
    client.post(
        "/api/v1/transactions",
        json={"title": "Consulting Bonus", "amount": 500.0, "type": "income", "category_id": cat_id},
    )

    # Search keyword
    res = client.get("/api/v1/transactions?search=Apple")
    assert res.status_code == 200
    items = res.json()["items"]
    assert any("Apple" in tx["title"] for tx in items)

    # Filter type
    inc_res = client.get(f"/api/v1/transactions?type=income&category_id={cat_id}")
    assert inc_res.status_code == 200
    for tx in inc_res.json()["items"]:
        assert tx["type"] == "income"
