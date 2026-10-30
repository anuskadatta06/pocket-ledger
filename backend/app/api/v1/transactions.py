from typing import List, Optional
from datetime import date
import math
from fastapi import APIRouter, Depends, HTTPException, Query, Body, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc
from app.db.deps import get_db
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.enums import TransactionType
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionRead
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=PaginatedResponse[TransactionRead])
def list_transactions(
    start_date: Optional[date] = Query(None, description="Filter from start date (inclusive)"),
    end_date: Optional[date] = Query(None, description="Filter to end date (inclusive)"),
    category_id: Optional[int] = Query(None, description="Filter by Category ID"),
    type: Optional[TransactionType] = Query(None, description="Filter by type (income or expense)"),
    search: Optional[str] = Query(None, description="Search keyword in title or notes"),
    min_amount: Optional[float] = Query(None, ge=0, description="Minimum amount"),
    max_amount: Optional[float] = Query(None, ge=0, description="Maximum amount"),
    sort_by: str = Query("date", regex="^(date|amount|title)$", description="Field to sort by"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    page: int = Query(1, ge=1, description="Page number starting at 1"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """List transactions with filtering, dynamic sorting, and pagination."""
    query = db.query(Transaction)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type:
        query = query.filter(Transaction.type == type)
    if min_amount is not None:
        query = query.filter(Transaction.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Transaction.amount <= max_amount)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Transaction.title.ilike(term),
                Transaction.notes.ilike(term),
            )
        )

    total = query.count()

    # Dynamic sorting
    sort_column = getattr(Transaction, sort_by)
    order_func = desc if sort_order.lower() == "desc" else asc
    query = query.order_by(order_func(sort_column), desc(Transaction.id))

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    pages = math.ceil(total / limit) if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.post("/bulk-delete")
def bulk_delete_transactions(
    ids: List[int] = Body(..., description="List of transaction IDs to delete"),
    db: Session = Depends(get_db),
):
    """Delete multiple transactions at once by ID list."""
    if not ids:
        return {"deleted_count": 0}

    deleted_count = (
        db.query(Transaction)
        .filter(Transaction.id.in_(ids))
        .delete(synchronize_session=False)
    )
    db.commit()
    return {"deleted_count": deleted_count}


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Retrieve a single transaction by its ID."""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {transaction_id} not found.",
        )
    return transaction


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new income or expense transaction."""
    category = db.query(Category).filter(Category.id == tx_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {tx_in.category_id} does not exist.",
        )

    transaction = Transaction(
        title=tx_in.title.strip(),
        amount=tx_in.amount,
        type=tx_in.type,
        date=tx_in.date,
        notes=tx_in.notes.strip() if tx_in.notes else None,
        category_id=tx_in.category_id,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction_full(
    transaction_id: int, tx_in: TransactionCreate, db: Session = Depends(get_db)
):
    """Full update of an existing transaction."""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {transaction_id} not found.",
        )

    category = db.query(Category).filter(Category.id == tx_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {tx_in.category_id} does not exist.",
        )

    transaction.title = tx_in.title.strip()
    transaction.amount = tx_in.amount
    transaction.type = tx_in.type
    transaction.date = tx_in.date
    transaction.notes = tx_in.notes.strip() if tx_in.notes else None
    transaction.category_id = tx_in.category_id

    db.commit()
    db.refresh(transaction)
    return transaction


@router.patch("/{transaction_id}", response_model=TransactionRead)
def update_transaction_partial(
    transaction_id: int, tx_in: TransactionUpdate, db: Session = Depends(get_db)
):
    """Partial update of an existing transaction."""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {transaction_id} not found.",
        )

    update_dict = tx_in.model_dump(exclude_unset=True)

    if "category_id" in update_dict and update_dict["category_id"] is not None:
        cat = db.query(Category).filter(Category.id == update_dict["category_id"]).first()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID {update_dict['category_id']} does not exist.",
            )

    for field, value in update_dict.items():
        if field == "title" and value:
            value = value.strip()
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Delete a transaction by ID."""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {transaction_id} not found.",
        )
    db.delete(transaction)
    db.commit()
    return None
