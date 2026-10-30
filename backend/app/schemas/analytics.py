from typing import List, Optional
from pydantic import BaseModel


class FinancialSummary(BaseModel):
    """Aggregate financial summary metrics."""
    total_income: float
    total_expense: float
    net_balance: float
    savings_rate: float
    transaction_count: int
