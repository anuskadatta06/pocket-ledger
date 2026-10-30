def test_create_and_update_budget(client):
    """Test creating and updating a category budget limit."""
    # Create category first
    cat_res = client.post(
        "/api/v1/categories",
        json={"name": "BudgetTestCat", "icon": "film", "color": "#999999"},
    )
    cat_id = cat_res.json()["id"]

    # Create budget
    budget_payload = {
        "category_id": cat_id,
        "monthly_limit": 300.0,
        "month": 11,
        "year": 2026,
    }
    res = client.post("/api/v1/budgets", json=budget_payload)
    assert res.status_code == 201
    budget_data = res.json()
    budget_id = budget_data["id"]
    assert budget_data["monthly_limit"] == 300.0

    # Update budget
    up_res = client.put(f"/api/v1/budgets/{budget_id}", json={"monthly_limit": 450.0})
    assert up_res.status_code == 200
    assert up_res.json()["monthly_limit"] == 450.0

    # Test listing
    list_res = client.get("/api/v1/budgets?month=11&year=2026")
    assert list_res.status_code == 200
    assert any(b["id"] == budget_id for b in list_res.json())

    # Test budget status
    status_res = client.get("/api/v1/budgets/status?month=11&year=2026")
    assert status_res.status_code == 200
    statuses = status_res.json()
    target_status = next((s for s in statuses if s["id"] == budget_id), None)
    assert target_status is not None
    assert target_status["monthly_limit"] == 450.0
    assert target_status["is_exceeded"] is False

    # Delete budget
    del_res = client.delete(f"/api/v1/budgets/{budget_id}")
    assert del_res.status_code == 204
