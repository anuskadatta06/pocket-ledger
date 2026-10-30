from datetime import date, timedelta
from app.db.session import SessionLocal, Base, engine
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.enums import TransactionType
from app.db.init_db import seed_default_categories


def seed_database():
    """Populate database with sample categories, budgets, and transactions."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("🌱 Seeding default categories...")
        seed_default_categories(db)

        # Retrieve categories by name
        categories = {cat.name: cat for cat in db.query(Category).all()}

        today = date.today()
        current_month = today.month
        current_year = today.year

        # Seed sample budgets for current month
        print("🌱 Seeding sample budgets...")
        budgets_data = [
            ("Food & Dining", 400.0),
            ("Housing & Rent", 1200.0),
            ("Transportation", 150.0),
            ("Entertainment", 100.0),
            ("Utilities & Bills", 200.0),
        ]
        for cat_name, limit in budgets_data:
            if cat_name in categories:
                cat_id = categories[cat_name].id
                existing_budget = (
                    db.query(Budget)
                    .filter(
                        Budget.category_id == cat_id,
                        Budget.month == current_month,
                        Budget.year == current_year,
                    )
                    .first()
                )
                if not existing_budget:
                    db.add(
                        Budget(
                            category_id=cat_id,
                            monthly_limit=limit,
                            month=current_month,
                            year=current_year,
                        )
                    )

        # Seed sample transactions
        print("🌱 Seeding sample transactions...")
        if db.query(Transaction).count() == 0:
            sample_txs = [
                ("Monthly Paycheck", 3500.00, TransactionType.INCOME, today - timedelta(days=28), "Salary / Income", "Direct deposit employer"),
                ("Apartment Rent", 1150.00, TransactionType.EXPENSE, today - timedelta(days=25), "Housing & Rent", "Monthly apartment lease"),
                ("Trader Joe's Groceries", 84.50, TransactionType.EXPENSE, today - timedelta(days=22), "Food & Dining", "Weekly grocery run"),
                ("Metro Transit Card", 45.00, TransactionType.EXPENSE, today - timedelta(days=20), "Transportation", "Subway monthly pass refill"),
                ("Electric & Gas Utility", 72.30, TransactionType.EXPENSE, today - timedelta(days=18), "Utilities & Bills", "City power utility"),
                ("Internet Fiber Bill", 60.00, TransactionType.EXPENSE, today - timedelta(days=15), "Utilities & Bills", "Fiber 500Mbps"),
                ("Italian Bistro Dinner", 56.20, TransactionType.EXPENSE, today - timedelta(days=12), "Food & Dining", "Dinner with friends"),
                ("Freelance Web Design", 600.00, TransactionType.INCOME, today - timedelta(days=10), "Salary / Income", "Landing page project"),
                ("Movie Theater Tickets", 28.00, TransactionType.EXPENSE, today - timedelta(days=8), "Entertainment", "Weekend cinema tickets"),
                ("Car Gas Station", 42.10, TransactionType.EXPENSE, today - timedelta(days=6), "Transportation", "Fuel fill-up"),
                ("Pharmacy Essentials", 18.75, TransactionType.EXPENSE, today - timedelta(days=4), "Healthcare", "Vitamins and allergy meds"),
                ("Whole Foods Groceries", 65.40, TransactionType.EXPENSE, today - timedelta(days=2), "Food & Dining", "Organic vegetables and fruits"),
                ("Coffee Roasters", 6.50, TransactionType.EXPENSE, today - timedelta(days=1), "Food & Dining", "Morning espresso"),
            ]

            for title, amount, tx_type, tx_date, cat_name, notes in sample_txs:
                if cat_name in categories:
                    db.add(
                        Transaction(
                            title=title,
                            amount=amount,
                            type=tx_type,
                            date=tx_date,
                            notes=notes,
                            category_id=categories[cat_name].id,
                        )
                    )

        db.commit()
        print("✅ Database seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
