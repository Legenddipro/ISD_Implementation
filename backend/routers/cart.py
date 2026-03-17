from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth_dep import get_current_user
from models.customer import Customer
from schemas.cart import AddItemRequest, CartResponse, CartItemResponse, CartTotalResponse
from services import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])


def _build_cart_response(data: dict, customer_id: int) -> CartResponse:
    cart = data["cart"]
    items = [
        CartItemResponse.from_cart_item(item, product_name)
        for item, product_name in data["items"]
    ]
    return CartResponse(
        id=cart.id,
        customer_id=customer_id,
        items=items,
        total_price=float(cart.total_price),
    )


@router.get("", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user),
):
    data = cart_service.get_cart_with_items(db, current_user.id)
    return _build_cart_response(data, current_user.id)


@router.post("/add", response_model=CartResponse)
def add_to_cart(
    request: AddItemRequest,
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user),
):
    data = cart_service.add_item(db, current_user.id, request.product_id, request.quantity)
    return _build_cart_response(data, current_user.id)


@router.delete("/remove/{item_id}", response_model=CartResponse)
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user),
):
    data = cart_service.remove_item(db, current_user.id, item_id)
    return _build_cart_response(data, current_user.id)


@router.get("/total", response_model=CartTotalResponse)
def get_total(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user),
):
    total = cart_service.get_cart_total(db, current_user.id)
    return CartTotalResponse(total_price=total)
