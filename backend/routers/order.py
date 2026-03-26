from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth_dep import get_current_user
from schemas.order import OrderCreate, OrderResponse, CouponValidateRequest, CouponValidateResponse
from services import order_service

router = APIRouter(prefix="/order", tags=["order"])


@router.post("/validate-coupon", response_model=CouponValidateResponse)
def validate_coupon(
    body: CouponValidateRequest,
    db: Session = Depends(get_db),
    current_customer=Depends(get_current_user),
):
    return order_service.validate_coupon(db, body.code, body.subtotal)


@router.post("/place", response_model=OrderResponse)
def place_order(
    body: OrderCreate,
    db: Session = Depends(get_db),
    current_customer=Depends(get_current_user),
):
    return order_service.place_order(db, current_customer.id, body)


@router.get("/eggclub-status")
def eggclub_status(
    db: Session = Depends(get_db),
    current_customer=Depends(get_current_user),
):
    return order_service.get_eggclub_status(db, current_customer.id)
