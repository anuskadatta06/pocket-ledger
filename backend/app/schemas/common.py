from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized paginated list envelope."""
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int
