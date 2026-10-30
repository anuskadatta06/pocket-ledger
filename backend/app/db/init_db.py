from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.category import Category

DEFAULT_CATEGORIES: List[Dict[str, Any]] = [
    {
        "name": "Food & Dining",
        "icon": "utensils",
        "color": "#EF4444",
        "description": "Restaurants, takeout, coffee shops, and groceries",
        "is_system": True,
    },
    {
        "name": "Housing & Rent",
        "icon": "home",
        "color": "#3B82F6",
        "description": "Rent, mortgage payments, maintenance, and property taxes",
        "is_system": True,
    },
    {
        "name": "Transportation",
        "icon": "car",
        "color": "#F59E0B",
        "description": "Fuel, public transit, rideshares, and vehicle maintenance",
        "is_system": True,
    },
    {
        "name": "Shopping & Groceries",
        "icon": "shopping-cart",
        "color": "#10B981",
        "description": "Supermarket, apparel, electronics, and supplies",
        "is_system": True,
    },
    {
        "name": "Entertainment",
        "icon": "film",
        "color": "#8B5CF6",
        "description": "Movies, concerts, streaming services, and games",
        "is_system": True,
    },
    {
        "name": "Utilities & Bills",
        "icon": "zap",
        "color": "#EC4899",
        "description": "Electricity, water, gas, internet, and mobile phone plans",
        "is_system": True,
    },
    {
        "name": "Salary / Income",
        "icon": "briefcase",
        "color": "#059669",
        "description": "Monthly paycheck, freelance work, and business revenue",
        "is_system": True,
    },
    {
        "name": "Healthcare",
        "icon": "activity",
        "color": "#14B8A6",
        "description": "Doctor visits, pharmacy, dental, and health insurance",
        "is_system": True,
    },
    {
        "name": "Miscellaneous",
        "icon": "tag",
        "color": "#6B7280",
        "description": "General and uncategorized expenses",
        "is_system": True,
    },
]


def seed_default_categories(db: Session) -> None:
    """Seed initial categories into the database if not already present."""
    for cat_data in DEFAULT_CATEGORIES:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
    db.commit()
