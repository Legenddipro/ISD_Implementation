from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.cart import Cart, CartItem
from models.coupon import Coupon
from models.eggclub import EggClubMembership
from models.order import Order, OrderItem, Shipment
from schemas.order import OrderCreate, CouponValidateResponse

DELIVERY_CHARGE = 50.0
FREE_DELIVERY_THRESHOLD = 500.0


# ──────────────────────────────────────────────
# EggClub helpers
# ──────────────────────────────────────────────

def get_eggclub_status(db: Session, customer_id: int) -> dict:
    membership = (
        db.query(EggClubMembership)
        .filter(
            EggClubMembership.customer_id == customer_id,
            EggClubMembership.is_active == True,
        )
        .first()
    )
    if membership is None:
        return {"is_member": False, "free_deliveries_left": 0}

    # Check expiry
    if membership.membership_end and membership.membership_end < datetime.now(timezone.utc):
        return {"is_member": False, "free_deliveries_left": 0}

    return {
        "is_member": True,
        "free_deliveries_left": membership.free_deliveries_left,
    }


# ──────────────────────────────────────────────
# Coupon helpers
# ──────────────────────────────────────────────

def _compute_discount(coupon: Coupon, subtotal: float) -> float:
    if coupon.discount_type == "percentage":
        return round(subtotal * float(coupon.discount_value) / 100, 2)
    else:  # fixed
        return min(float(coupon.discount_value), subtotal)


def validate_coupon(db: Session, code: str, subtotal: float) -> CouponValidateResponse:
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()

    if coupon is None:
        return CouponValidateResponse(valid=False, message="Coupon not found or inactive.")

    now = datetime.now(timezone.utc)
    if coupon.valid_until and coupon.valid_until < now:
        return CouponValidateResponse(valid=False, message="Coupon has expired.")

    if coupon.max_usage is not None and coupon.times_used >= coupon.max_usage:
        return CouponValidateResponse(valid=False, message="Coupon usage limit reached.")

    if subtotal < float(coupon.min_order_amount):
        return CouponValidateResponse(
            valid=False,
            message=f"Minimum order amount for this coupon is ৳{coupon.min_order_amount}.",
        )

    discount_amount = _compute_discount(coupon, subtotal)
    return CouponValidateResponse(
        valid=True,
        discount_type=coupon.discount_type,
        discount_value=float(coupon.discount_value),
        discount_amount=discount_amount,
        message="Coupon applied successfully.",
    )


# ──────────────────────────────────────────────
# Place order
# ──────────────────────────────────────────────

def place_order(db: Session, customer_id: int, body: OrderCreate) -> Order:
    # 1. Load cart
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        raise HTTPException(status_code=400, detail="Cart not found.")

    cart_items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty.")

    subtotal = float(cart.total_price)

    # 2. Coupon
    coupon_id = None
    discount_amount = 0.0
    if body.coupon_code:
        result = validate_coupon(db, body.coupon_code, subtotal)
        if not result.valid:
            raise HTTPException(status_code=400, detail=result.message)
        coupon = db.query(Coupon).filter(Coupon.code == body.coupon_code).first()
        coupon_id = coupon.id
        discount_amount = result.discount_amount
        coupon.times_used += 1

    # 3. EggClub / delivery charge
    used_free_delivery = False
    delivery_charge = DELIVERY_CHARGE

    if subtotal >= FREE_DELIVERY_THRESHOLD:
        delivery_charge = 0.0
    elif body.use_free_delivery:
        membership = (
            db.query(EggClubMembership)
            .filter(
                EggClubMembership.customer_id == customer_id,
                EggClubMembership.is_active == True,
            )
            .first()
        )
        if membership and membership.free_deliveries_left > 0:
            delivery_charge = 0.0
            used_free_delivery = True
            membership.free_deliveries_left -= 1

    total_amount = subtotal - discount_amount + delivery_charge

    # 4. Create order
    order = Order(
        customer_id=customer_id,
        coupon_id=coupon_id,
        subtotal=subtotal,
        discount_amount=discount_amount,
        delivery_charge=delivery_charge,
        total_amount=total_amount,
        delivery_address=body.delivery_address,
        delivery_city=body.delivery_city,
        delivery_time=body.delivery_time,
        delivery_type=body.delivery_type,
        payment_method=body.payment_method,
        status="pending",
        used_free_delivery=used_free_delivery,
    )
    db.add(order)
    db.flush()  # get order.id

    # 5. Create order items
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        db.add(order_item)

    # 6. Create shipment record
    shipment = Shipment(order_id=order.id, status="pending")
    db.add(shipment)

    # 7. Clear cart
    for item in cart_items:
        db.delete(item)
    cart.total_price = 0

    db.commit()
    db.refresh(order)
    return order
