from fastapi import APIRouter
from app.api.v1.categories import router as categories_router
from app.api.v1.budgets import router as budgets_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.analytics import router as analytics_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(categories_router)
api_router.include_router(budgets_router)
api_router.include_router(transactions_router)
api_router.include_router(analytics_router)
