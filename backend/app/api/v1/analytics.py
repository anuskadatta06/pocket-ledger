from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.deps import get_db
from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.schemas.analytics import FinancialSummary

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=FinancialSummary)
def get_financial_summary(
    start_date: Optional[date] = Query(None, description="Start date for summary"),
    end_date: Optional[date] = Query(None, description="End date for summary"),
    db: Session = Depends(get_db),
):
    """Retrieve aggregate financial totals: income, expenses, and net balance."""
    query = db.query(Transaction)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    income_total = (
        query.filter(Transaction.type == TransactionType.INCOME)
        .with_entities(func.coalesce(func.sum(Transaction.amount), 0.0))
        .scalar()
    ) or 0.0

    expense_total = (
        query.filter(Transaction.type == TransactionType.EXPENSE)
        .with_entities(func.coalesce(func.sum(Transaction.amount), 0.0))
        .scalar()
    ) or 0.0

    count = query.count()

    return FinancialSummary(
        total_income=round(float(income_total), 2),
        total_expense=round(float(expense_total), 2),
        net_balance=round(float(income_total - expense_total), 2),
        transaction_count=count,
    )
