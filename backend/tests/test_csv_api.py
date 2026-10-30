import io


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


def test_import_csv_endpoint(client):
    """Test importing valid CSV transactions."""
    csv_content = (
        "Title,Amount,Type,Date,Category,Notes\n"
        "Coffee Shop,5.75,expense,2026-10-15,Miscellaneous,Morning latte\n"
        "Freelance Gig,350.00,income,2026-10-16,Salary / Income,Consulting\n"
    )
    files = {"file": ("test_import.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/v1/csv/import", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["imported_count"] == 2


def test_import_csv_non_csv_extension_rejected(client):
    """Test that non-csv files are rejected with 400 Bad Request."""
    files = {"file": ("malicious.exe", io.BytesIO(b"binary"), "application/octet-stream")}
    response = client.post("/api/v1/csv/import", files=files)
    assert response.status_code == 400
