from sqlalchemy import Column, Integer, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class Budget(Base, TimestampMixin):
    """Budget model representing monthly spending limit per category."""

    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    monthly_limit = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)  # 1 to 12
    year = Column(Integer, nullable=False)   # e.g., 2026

    # Ensure one budget record per category per month/year
    __table_args__ = (
        UniqueConstraint("category_id", "month", "year", name="uq_category_month_year"),
    )

    # Relationships
    category = relationship("Category", back_populates="budgets")
