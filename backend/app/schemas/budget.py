from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.schemas.category import CategoryRead


class BudgetBase(BaseModel):
    """Base schema for category budget limits."""
    category_id: int = Field(..., description="Target Category ID")
    monthly_limit: float = Field(..., gt=0, description="Monthly spending limit")
    month: int = Field(..., ge=1, le=12, description="Month (1-12)")
    year: int = Field(..., ge=2000, le=2100, description="Year (e.g. 2026)")

    @field_validator("monthly_limit")
    @classmethod
    def round_limit(cls, v: float) -> float:
        return round(v, 2)


class BudgetCreate(BudgetBase):
    """Schema for setting a category budget."""
    pass


class BudgetUpdate(BaseModel):
    """Schema for updating a budget limit."""
    monthly_limit: float = Field(..., gt=0)

    @field_validator("monthly_limit")
    @classmethod
    def round_limit(cls, v: float) -> float:
        return round(v, 2)


class BudgetRead(BudgetBase):
    """Schema for returning budget information."""
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None

    model_config = ConfigDict(from_attributes=True)


class BudgetStatus(BaseModel):
    """Calculated budget progress status."""
    id: int
    category_id: int
    category_name: str
    category_color: str
    category_icon: str
    monthly_limit: float
    spent_amount: float
    remaining_amount: float
    percentage_used: float
    is_exceeded: bool
    month: int
    year: int
