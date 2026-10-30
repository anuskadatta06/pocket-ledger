# 📡 API Payload Examples

### 1. Create Transaction (`POST /api/v1/transactions`)
```json
{
  "title": "Whole Foods Market",
  "amount": 76.40,
  "type": "expense",
  "date": "2026-10-31",
  "category_id": 1,
  "notes": "Weekly groceries and pantry restocking"
}
```

### 2. Set Monthly Budget (`POST /api/v1/budgets`)
```json
{
  "category_id": 1,
  "monthly_limit": 500.00,
  "month": 11,
  "year": 2026
}
```

### 3. Financial Summary (`GET /api/v1/analytics/summary`)
```json
{
  "total_income": 4100.00,
  "total_expense": 1850.25,
  "net_balance": 2249.75,
  "savings_rate": 54.9,
  "transaction_count": 18
}
```
