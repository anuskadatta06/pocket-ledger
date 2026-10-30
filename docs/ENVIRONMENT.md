# ⚙️ Environment Configuration Reference

### Backend (`backend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `APP_NAME` | string | `PocketLedger API` | The public name shown in documentation |
| `APP_ENV` | string | `development` | Runtime environment (`development`, `production`) |
| `DEBUG` | boolean | `True` | Enables verbose tracebacks on errors |
| `PORT` | integer | `8000` | Local port for FastAPI Uvicorn server |
| `HOST` | string | `0.0.0.0` | Binding host address |
| `DATABASE_URL` | string | `sqlite:///./pocket_ledger.db` | SQLAlchemy connection string |
| `CORS_ORIGINS` | string | `http://localhost:3000` | Comma-delimited list of permitted web origins |

### Frontend (`frontend/.env.local`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | string | `http://localhost:8000/api/v1` | Base REST API URL accessed by browser |
