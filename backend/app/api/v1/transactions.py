from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionRead

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=List[TransactionRead])
def list_transactions(db: Session = Depends(get_db)):
    """List transactions ordered by date descending."""
    return db.query(Transaction).order_by(Transaction.date.desc(), Transaction.id.desc()).all()
