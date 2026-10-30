from datetime import date
from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin
from app.models.enums import TransactionType


class Transaction(Base, TimestampMixin):
    """Transaction model representing an income or expense record."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    type = Column(SQLEnum(TransactionType), default=TransactionType.EXPENSE, nullable=False, index=True)
    date = Column(Date, default=date.today, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)

    # Relationships
    category = relationship("Category", back_populates="transactions")
