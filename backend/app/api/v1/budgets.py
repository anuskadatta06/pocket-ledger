from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.budget import Budget
from app.models.category import Category
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetRead

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


@router.post("", response_model=BudgetRead, status_code=status.HTTP_201_CREATED)
def create_budget(budget_in: BudgetCreate, db: Session = Depends(get_db)):
    """Set or create a budget limit for a category for a given month and year."""
    category = db.query(Category).filter(Category.id == budget_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {budget_in.category_id} not found",
        )

    # Check if budget already exists for this category and month/year
    existing = (
        db.query(Budget)
        .filter(
            Budget.category_id == budget_in.category_id,
            Budget.month == budget_in.month,
            Budget.year == budget_in.year,
        )
        .first()
    )
    if existing:
        # Update existing budget limit
        existing.monthly_limit = budget_in.monthly_limit
        db.commit()
        db.refresh(existing)
        return existing

    budget = Budget(
        category_id=budget_in.category_id,
        monthly_limit=budget_in.monthly_limit,
        month=budget_in.month,
        year=budget_in.year,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.put("/{budget_id}", response_model=BudgetRead)
def update_budget(
    budget_id: int, budget_in: BudgetUpdate, db: Session = Depends(get_db)
):
    """Update an existing budget amount."""
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with ID {budget_id} not found",
        )
    budget.monthly_limit = budget_in.monthly_limit
    db.commit()
    db.refresh(budget)
    return budget
