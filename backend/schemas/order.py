from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CouponValidateRequest(BaseModel):
    code: str
    subtotal: float


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    discount_amount: Optional[float] = None
    message: str


class OrderCreate(BaseModel):
    delivery_address: str
    delivery_city: Optional[str] = None
    delivery_time: Optional[datetime] = None
    delivery_type: str = "standard"          # "standard" | "scheduled"
    payment_method: str = "cod"              # "cod" | "online"
    coupon_code: Optional[str] = None
    use_free_delivery: bool = False          # request to use EggClub free delivery


class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    subtotal: float
    discount_amount: float
    delivery_charge: float
    total_amount: float
    delivery_address: str
    delivery_city: Optional[str]
    delivery_type: str
    payment_method: str
    status: str
    used_free_delivery: bool
    created_at: datetime

    class Config:
        from_attributes = True
