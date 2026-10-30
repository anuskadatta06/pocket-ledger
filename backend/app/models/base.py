from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func


class TimestampMixin:
    """Mixin adding created_at and updated_at datetime timestamps to models."""

    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        server_default=func.now(),
        onupdate=datetime.utcnow,
        nullable=False,
    )
