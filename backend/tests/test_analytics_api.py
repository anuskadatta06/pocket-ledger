def test_financial_summary_calculation(client):
    """Test income, expense, net balance and savings rate calculations."""
    cat_res = client.post(
        "/api/v1/categories",
        json={"name": "AnalyticsCat", "icon": "pie-chart", "color": "#112233"},
    )
    cat_id = cat_res.json()["id"]

    # Add 1000 Income
    client.post(
        "/api/v1/transactions",
        json={"title": "Salary Bonus", "amount": 1000.0, "type": "income", "category_id": cat_id},
    )
    # Add 400 Expense
    client.post(
        "/api/v1/transactions",
        json={"title": "New Gadget", "amount": 400.0, "type": "expense", "category_id": cat_id},
    )

    res = client.get("/api/v1/analytics/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_income"] >= 1000.0
    assert data["total_expense"] >= 400.0
    assert data["net_balance"] == round(data["total_income"] - data["total_expense"], 2)
    assert data["savings_rate"] >= 0.0
