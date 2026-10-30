import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.enums import TransactionType
from app.db.init_db import seed_default_categories


@pytest.fixture
def db_session():
    """In-memory SQLite session for testing models."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_category_creation(db_session):
    """Test creating a category and querying it."""
    category = Category(name="Test Category", icon="tag", color="#123456", description="Desc")
    db_session.add(category)
    db_session.commit()

    retrieved = db_session.query(Category).filter_by(name="Test Category").first()
    assert retrieved is not None
    assert retrieved.color == "#123456"
    assert retrieved.is_system is False


def test_transaction_category_relationship(db_session):
    """Test transaction references category and relationship works both ways."""
    cat = Category(name="Groceries", icon="shopping-cart", color="#00ff00")
    db_session.add(cat)
    db_session.commit()

    tx = Transaction(
        title="Supermarket",
        amount=50.25,
        type=TransactionType.EXPENSE,
        date=date(2026, 1, 15),
        category_id=cat.id,
    )
    db_session.add(tx)
    db_session.commit()

    assert tx.category.name == "Groceries"
    assert len(cat.transactions) == 1
    assert cat.transactions[0].title == "Supermarket"


def test_budget_creation(db_session):
    """Test budget limit model per category."""
    cat = Category(name="Entertainment", icon="film", color="#ff0000")
    db_session.add(cat)
    db_session.commit()

    budget = Budget(category_id=cat.id, monthly_limit=250.0, month=10, year=2026)
    db_session.add(budget)
    db_session.commit()

    assert budget.monthly_limit == 250.0
    assert budget.category.name == "Entertainment"


def test_seed_default_categories(db_session):
    """Test seed helper inserts default categories without duplicates."""
    seed_default_categories(db_session)
    count = db_session.query(Category).count()
    assert count >= 8

    # Second run should be idempotent
    seed_default_categories(db_session)
    assert db_session.query(Category).count() == count
