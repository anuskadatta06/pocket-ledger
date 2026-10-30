import io
import csv
from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from app.db.deps import get_db
from app.models.transaction import Transaction

router = APIRouter(prefix="/csv", tags=["CSV Operations"])


@router.get("/export")
def export_transactions_csv(
    start_date: Optional[date] = Query(None, description="Export transactions from this date"),
    end_date: Optional[date] = Query(None, description="Export transactions up to this date"),
    db: Session = Depends(get_db),
):
    """Export transactions as a downloadable CSV spreadsheet."""
    query = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .order_by(Transaction.date.desc())
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Write CSV Header
    writer.writerow(["ID", "Title", "Amount", "Type", "Date", "Category", "Notes"])

    # Write CSV Rows
    for tx in transactions:
        writer.writerow([
            tx.id,
            tx.title,
            f"{tx.amount:.2f}",
            tx.type.value if hasattr(tx.type, "value") else str(tx.type),
            tx.date.isoformat(),
            tx.category.name if tx.category else "Uncategorized",
            tx.notes or "",
        ])

    output.seek(0)
    filename = f"pocket_ledger_export_{date.today().isoformat()}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
