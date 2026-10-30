from typing import List, Optional
from datetime import date
import calendar
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.db.deps import get_db
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.enums import TransactionType
from app.schemas.analytics import FinancialSummary, CategoryBreakdown, MonthlyTrend

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=FinancialSummary)
def get_financial_summary(
    start_date: Optional[date] = Query(None, description="Start date for summary"),
    end_date: Optional[date] = Query(None, description="End date for summary"),
    db: Session = Depends(get_db),
):
    """Retrieve aggregate financial totals: income, expenses, and net balance with savings rate."""
    query = db.query(Transaction)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    income_total = float(
        (
            query.filter(Transaction.type == TransactionType.INCOME)
            .with_entities(func.coalesce(func.sum(Transaction.amount), 0.0))
            .scalar()
        )
        or 0.0
    )

    expense_total = float(
        (
            query.filter(Transaction.type == TransactionType.EXPENSE)
            .with_entities(func.coalesce(func.sum(Transaction.amount), 0.0))
            .scalar()
        )
        or 0.0
    )

    count = query.count()
    net = income_total - expense_total
    savings_rate = round((net / income_total * 100) if income_total > 0 else 0.0, 1)

    return FinancialSummary(
        total_income=round(income_total, 2),
        total_expense=round(expense_total, 2),
        net_balance=round(net, 2),
        savings_rate=savings_rate,
        transaction_count=count,
    )


@router.get("/category-breakdown", response_model=List[CategoryBreakdown])
def get_category_breakdown(
    type: TransactionType = Query(TransactionType.EXPENSE, description="Transaction type to breakdown"),
    start_date: Optional[date] = Query(None, description="Filter start date"),
    end_date: Optional[date] = Query(None, description="Filter end date"),
    db: Session = Depends(get_db),
):
    """Group transactions by category with total amount, count and percentage."""
    query = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            Category.color.label("category_color"),
            Category.icon.label("category_icon"),
            func.coalesce(func.sum(Transaction.amount), 0.0).label("total_amount"),
            func.count(Transaction.id).label("transaction_count"),
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.type == type)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    results = query.group_by(Category.id).order_by(func.sum(Transaction.amount).desc()).all()

    grand_total = sum(r.total_amount for r in results) or 1.0

    breakdown = []
    for r in results:
        amount = round(float(r.total_amount), 2)
        pct = round((amount / grand_total * 100), 1)
        breakdown.append(
            CategoryBreakdown(
                category_id=r.category_id,
                category_name=r.category_name,
                category_color=r.category_color,
                category_icon=r.category_icon,
                total_amount=amount,
                percentage=pct,
                transaction_count=r.transaction_count,
            )
        )
    return breakdown


@router.get("/monthly-trend", response_model=List[MonthlyTrend])
def get_monthly_trend(
    months: int = Query(6, ge=1, le=24, description="Number of past months to retrieve"),
    db: Session = Depends(get_db),
):
    """Retrieve monthly income, expense and net cash flow for charts."""
    # Group transactions by year and month
    rows = (
        db.query(
            extract("year", Transaction.date).label("year"),
            extract("month", Transaction.date).label("month"),
            Transaction.type.label("type"),
            func.sum(Transaction.amount).label("total"),
        )
        .group_by(
            extract("year", Transaction.date),
            extract("month", Transaction.date),
            Transaction.type,
        )
        .order_by(
            extract("year", Transaction.date).desc(),
            extract("month", Transaction.date).desc(),
        )
        .all()
    )

    # Aggregate by (year, month)
    monthly_data = {}
    for r in rows:
        key = (int(r.year), int(r.month))
        if key not in monthly_data:
            monthly_data[key] = {"income": 0.0, "expense": 0.0}
        if r.type == TransactionType.INCOME:
            monthly_data[key]["income"] = float(r.total)
        else:
            monthly_data[key]["expense"] = float(r.total)

    trend = []
    sorted_keys = sorted(monthly_data.keys())[-months:]
    for y, m in sorted_keys:
        inc = round(monthly_data[(y, m)]["income"], 2)
        exp = round(monthly_data[(y, m)]["expense"], 2)
        month_name = f"{calendar.month_abbr[m]} {y}"
        trend.append(
            MonthlyTrend(
                year=y,
                month=m,
                month_name=month_name,
                income=inc,
                expense=exp,
                net=round(inc - exp, 2),
            )
        )
    return trend
