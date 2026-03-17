from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class AddItemRequest(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float

    @classmethod
    def from_cart_item(cls, item, product_name: str) -> CartItemResponse:
        return cls(
            id=item.id,
            product_id=item.product_id,
            product_name=product_name,
            quantity=item.quantity,
            unit_price=float(item.unit_price),
            subtotal=float(item.quantity * item.unit_price),
        )


class CartResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    items: list[CartItemResponse]
    total_price: float


class CartTotalResponse(BaseModel):
    total_price: float
