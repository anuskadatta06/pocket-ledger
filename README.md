# 💰 PocketLedger

> A clean, responsive personal expense and budget tracker built with a **FastAPI (Python)** backend and a **Next.js (React/TypeScript)** frontend.

---

## 🌟 Features (Planned & In-Progress)

- [ ] **Transactions Management**: Log, view, edit, and delete income and expense records.
- [ ] **Category & Budget Goals**: Set monthly budgets per category with spending progress alerts.
- [ ] **Interactive Analytics**: Monthly breakdown charts and category distributions powered by Recharts.
- [ ] **Search & Filtering**: Filter by date range, category, or search through transaction notes.
- [ ] **Data Export**: Export expenses to CSV for external accounting.
- [ ] **Dark & Light Mode**: Accessible, modern UI built with Tailwind CSS.

---

## 🏗️ Architecture

```
pocket-ledger/
├── backend/          # FastAPI Python REST API (SQLite + SQLAlchemy)
├── frontend/         # Next.js App Router (TypeScript + Tailwind CSS)
└── README.md
```

---

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API documentation available at `http://localhost:8000/docs`.

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
