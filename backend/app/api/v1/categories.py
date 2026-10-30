from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
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
    """Create a new custom category with duplicate name validation."""
    clean_name = category_in.name.strip()
    existing = (
        db.query(Category)
        .filter(func.lower(Category.name) == func.lower(clean_name))
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{clean_name}' already exists.",
        )

    category = Category(
        name=clean_name,
        icon=category_in.icon,
        color=category_in.color,
        description=category_in.description,
        is_system=False,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
