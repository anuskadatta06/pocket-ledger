def test_export_csv_endpoint(client):
    """Test streaming CSV export endpoint and attachment headers."""
    response = client.get("/api/v1/csv/export")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "attachment; filename=" in response.headers["content-disposition"]
    text = response.text
    assert "Transaction ID" in text
    assert "Title" in text
    assert "Amount" in text
