from fastapi import APIRouter
from app.api.v1.categories import router as categories_router
from app.api.v1.budgets import router as budgets_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(categories_router)
api_router.include_router(budgets_router)
