from typing import List, Optional
from pydantic import BaseModel


class FinancialSummary(BaseModel):
    """Aggregate financial summary metrics."""
    total_income: float
    total_expense: float
    net_balance: float
    savings_rate: float
    transaction_count: int


class CategoryBreakdown(BaseModel):
    """Spending breakdown for a category."""
    category_id: int
    category_name: str
    category_color: str
    category_icon: str
    total_amount: float
    percentage: float
    transaction_count: int


class MonthlyTrend(BaseModel):
    """Monthly income vs expense historical point."""
    year: int
    month: int
    month_name: str
    income: float
    expense: float
    net: float
