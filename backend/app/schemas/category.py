from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class CategoryBase(BaseModel):
    """Base schema for category attributes."""
    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    icon: str = Field("tag", max_length=50, description="Lucide icon name")
    color: str = Field("#6B7280", max_length=20, description="Hex color code (e.g. #10B981)")
    description: Optional[str] = Field(None, max_length=255, description="Optional description")


class CategoryCreate(CategoryBase):
    """Schema for creating a category."""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=255)


class CategoryRead(CategoryBase):
    """Schema for returning category details."""
    id: int
    is_system: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
