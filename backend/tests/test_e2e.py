def test_end_to_end_workflow(client):
    """Smoke test full end-to-end user workflow: category -> transaction -> summary -> export."""
    # 1. Create a category
    cat_res = client.post("/api/v1/categories", json={
        "name": "E2ECat",
        "icon": "activity",
        "color": "#123456"
    })
    assert cat_res.status_code == 201
    cat_id = cat_res.json()["id"]

    # 2. Add an expense
    tx_res = client.post("/api/v1/transactions", json={
        "title": "E2E Expense",
        "amount": 75.0,
        "type": "expense",
        "category_id": cat_id
    })
    assert tx_res.status_code == 201

    # 3. Fetch summary
    sum_res = client.get("/api/v1/analytics/summary")
    assert sum_res.status_code == 200
    assert sum_res.json()["total_expense"] >= 75.0

    # 4. Verify CSV export contains transaction
    csv_res = client.get("/api/v1/csv/export")
    assert csv_res.status_code == 200
    assert "E2E Expense" in csv_res.text
