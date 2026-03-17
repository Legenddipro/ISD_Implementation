from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from schemas.product import ProductResponse, CategoryResponse
from services import product_service

router = APIRouter(prefix="/products", tags=["Products"])
category_router = APIRouter(prefix="/categories", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    search: str | None = Query(None),
    category_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    rows = product_service.get_all_products(db, search, category_id)
    return [ProductResponse.from_product(product, cat_name) for product, cat_name in rows]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    result = product_service.get_product_by_id(db, product_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Product not found")
    product, cat_name = result
    return ProductResponse.from_product(product, cat_name)


@category_router.get("", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return product_service.get_all_categories(db)
