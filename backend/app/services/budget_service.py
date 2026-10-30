from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.schemas.budget import BudgetStatus


def calculate_budget_status(budget: Budget, db: Session) -> BudgetStatus:
    """Calculate spending progress, percentage and remaining budget for a category."""
    # Sum expense transactions for this category in the given month and year
    spent_query = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.category_id == budget.category_id,
            Transaction.type == TransactionType.EXPENSE,
            extract("month", Transaction.date) == budget.month,
            extract("year", Transaction.date) == budget.year,
        )
        .scalar()
    )
    spent = round(float(spent_query), 2)
    remaining = round(budget.monthly_limit - spent, 2)
    percentage = round((spent / budget.monthly_limit * 100) if budget.monthly_limit > 0 else 0.0, 1)

    return BudgetStatus(
        id=budget.id,
        category_id=budget.category_id,
        category_name=budget.category.name if budget.category else "Unknown",
        category_color=budget.category.color if budget.category else "#6B7280",
        category_icon=budget.category.icon if budget.category else "tag",
        monthly_limit=budget.monthly_limit,
        spent_amount=spent,
        remaining_amount=remaining,
        percentage_used=percentage,
        is_exceeded=spent > budget.monthly_limit,
        month=budget.month,
        year=budget.year,
    )
