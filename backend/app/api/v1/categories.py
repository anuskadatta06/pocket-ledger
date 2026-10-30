from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    """List all categories ordered by name."""
    return db.query(Category).order_by(Category.name.asc()).all()


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new custom category."""
    category = Category(
        name=category_in.name.strip(),
        icon=category_in.icon,
        color=category_in.color,
        description=category_in.description,
        is_system=False,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
