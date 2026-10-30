from enum import Enum


class TransactionType(str, Enum):
    """Enumeration of transaction types: income or expense."""

    INCOME = "income"
    EXPENSE = "expense"
