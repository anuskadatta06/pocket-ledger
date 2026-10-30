from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.budget import Budget
from app.schemas.budget import BudgetRead

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("", response_model=List[BudgetRead])
def list_budgets(
    month: Optional[int] = Query(None, ge=1, le=12, description="Target month (1-12)"),
    year: Optional[int] = Query(None, ge=2000, le=2100, description="Target year"),
    db: Session = Depends(get_db),
):
    """List budgets, optionally filtered by month and year."""
    query = db.query(Budget)
    if month is not None:
        query = query.filter(Budget.month == month)
    if year is not None:
        query = query.filter(Budget.year == year)
    return query.all()
