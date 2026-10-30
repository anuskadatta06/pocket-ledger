from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.enums import TransactionType
from app.schemas.category import CategoryRead


class TransactionBase(BaseModel):
    """Base schema for transaction attributes."""
    title: str = Field(..., min_length=1, max_length=200, description="Short title or payee")
    amount: float = Field(..., gt=0, description="Positive transaction amount")
    type: TransactionType = Field(default=TransactionType.EXPENSE, description="Transaction type")
    date: date = Field(default_factory=date.today, description="Transaction date")
    notes: Optional[str] = Field(None, description="Optional notes or memos")
    category_id: int = Field(..., description="Foreign key to Category")

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        """Round amount to 2 decimal places."""
        if v <= 0:
            raise ValueError("Amount must be strictly greater than 0")
        return round(v, 2)


class TransactionCreate(TransactionBase):
    """Schema for creating a transaction."""
    pass


class TransactionUpdate(BaseModel):
    """Schema for updating a transaction."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[TransactionType] = None
    date: Optional[date] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if v <= 0:
                raise ValueError("Amount must be strictly greater than 0")
            return round(v, 2)
        return v


class TransactionRead(TransactionBase):
    """Schema for returning transaction details."""
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None

    model_config = ConfigDict(from_attributes=True)
