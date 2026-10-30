import io
import csv
from typing import Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, Query, UploadFile, File, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from app.db.deps import get_db
from app.models.transaction import Transaction
from app.models.category import Category
from app.models.enums import TransactionType

router = APIRouter(prefix="/csv", tags=["CSV Operations"])


@router.get("/export")
def export_transactions_csv(
    start_date: Optional[date] = Query(None, description="Export transactions from this date"),
    end_date: Optional[date] = Query(None, description="Export transactions up to this date"),
    db: Session = Depends(get_db),
):
    """Export transactions as a downloadable CSV spreadsheet with formatted headers."""
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
    writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

    # Write Standardized CSV Header
    writer.writerow([
        "Transaction ID",
        "Title",
        "Amount",
        "Type",
        "Date",
        "Category Name",
        "Category Color",
        "Notes",
    ])

    # Write CSV Rows with clean formatting
    for tx in transactions:
        writer.writerow([
            tx.id,
            tx.title,
            f"{tx.amount:.2f}",
            tx.type.value if hasattr(tx.type, "value") else str(tx.type),
            tx.date.strftime("%Y-%m-%d"),
            tx.category.name if tx.category else "Uncategorized",
            tx.category.color if tx.category else "#6B7280",
            (tx.notes or "").replace("\n", " ").strip(),
        ])

    output.seek(0)
    filename = f"pocket_ledger_export_{date.today().isoformat()}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/import")
async def import_transactions_csv(
    file: UploadFile = File(..., description="CSV file with transactions"),
    db: Session = Depends(get_db),
):
    """Import transactions in bulk from an uploaded CSV file with validation."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid .csv spreadsheet",
        )

    content = await file.read()
    decoded = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(decoded))

    if not reader.fieldnames:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV file is empty or missing headers.",
        )

    # Pre-fetch existing categories mapped by lower-case name
    categories = {c.name.lower(): c.id for c in db.query(Category).all()}
    misc_cat = db.query(Category).filter(Category.name == "Miscellaneous").first()
    misc_id = misc_cat.id if misc_cat else (list(categories.values())[0] if categories else None)

    imported_count = 0
    skipped_count = 0
    errors = []

    for idx, row in enumerate(reader, start=2):
        try:
            title = (row.get("Title") or row.get("title") or "").strip()
            if not title:
                skipped_count += 1
                errors.append(f"Row {idx}: Missing title, skipping row.")
                continue

            raw_amount = (row.get("Amount") or row.get("amount") or "").replace("$", "").replace(",", "").strip()
            try:
                amount = float(raw_amount)
                if amount <= 0:
                    skipped_count += 1
                    errors.append(f"Row {idx}: Amount must be positive, got '{raw_amount}'.")
                    continue
            except ValueError:
                skipped_count += 1
                errors.append(f"Row {idx}: Invalid number format for amount '{raw_amount}'.")
                continue

            raw_type = (row.get("Type") or row.get("type") or "expense").strip().lower()
            tx_type = TransactionType.INCOME if raw_type == "income" else TransactionType.EXPENSE

            date_str = (row.get("Date") or row.get("date") or "").strip()
            if date_str:
                parsed_date = None
                for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
                    try:
                        parsed_date = datetime.strptime(date_str, fmt).date()
                        break
                    except ValueError:
                        pass
                if not parsed_date:
                    tx_date = date.today()
                    errors.append(f"Row {idx}: Unrecognized date '{date_str}', defaulted to today.")
                else:
                    tx_date = parsed_date
            else:
                tx_date = date.today()

            cat_name = (row.get("Category Name") or row.get("Category") or row.get("category") or "").strip().lower()
            cat_id = categories.get(cat_name, misc_id)

            if cat_id is None:
                skipped_count += 1
                errors.append(f"Row {idx}: No valid category found and no default category available.")
                continue

            notes = (row.get("Notes") or row.get("notes") or "").strip() or None

            tx = Transaction(
                title=title,
                amount=round(amount, 2),
                type=tx_type,
                date=tx_date,
                category_id=cat_id,
                notes=notes,
            )
            db.add(tx)
            imported_count += 1
        except Exception as e:
            skipped_count += 1
            errors.append(f"Row {idx}: Unexpected error - {str(e)}")

    db.commit()
    return {
        "success": True,
        "imported_count": imported_count,
        "skipped_count": skipped_count,
        "errors": errors,
    }
