# 💰 PocketLedger

> A modern, full-stack personal finance and budget tracker with a **FastAPI (Python)** backend and a **Next.js 14 (TypeScript & Tailwind CSS)** frontend.

---

## 🌟 Key Features

- **Transactions Dashboard**: Full CRUD for income and expenses with date-range, category, and keyword search filtering.
- **Budget Limits & Progress Tracking**: Set monthly spending ceilings per category with automated warning thresholds and percentage meters.
- **Visual Analytics**: Interactive monthly cash-flow trends, savings rate meters, and category spending distributions.
- **CSV Data Import/Export**: One-click export and validation-checked batch spreadsheet uploads.
- **Dark/Light Mode**: First-class theme support with automatic system preference detection.
- **Responsive Mobile First**: Full mobile bottom navigation, drawers, and optimized table overflow.

---

## 🏗️ Architecture

```
pocket-ledger/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Endpoints for categories, budgets, transactions, analytics, CSV
│   │   ├── db/             # SQLAlchemy engine, session factory, dependencies
│   │   ├── models/         # ORM models (Category, Transaction, Budget)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── services/       # Aggregation & business logic
│   └── tests/              # Full pytest test suite
├── frontend/
│   ├── app/                # Next.js App Router (Dashboard, Transactions, Budgets, Categories, Settings)
│   ├── components/         # Reusable atomic UI & feature widgets
│   ├── lib/                # API client, charts, date/currency utilities
│   └── types/              # TypeScript interface contracts
└── docker-compose.yml      # Container orchestration
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python seed.py   # Populates default categories and sample transactions
python run.py    # Runs on http://localhost:8000
```
Interactive API docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:3000
```

### 3. Docker One-Command Run
```bash
docker-compose up --build
```
