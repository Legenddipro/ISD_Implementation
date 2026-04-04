from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.cart import Cart, CartItem
from models.product import Product


ZERO = Decimal("0.00")


def get_or_create_cart(db: Session, customer_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        cart = Cart(customer_id=customer_id, total_price=ZERO)
        db.add(cart)
        db.flush()
    return cart


def get_cart_with_items(db: Session, customer_id: int) -> dict:
    cart = get_or_create_cart(db, customer_id)
    if cart.id is None:
        db.commit()
    return _build_cart_payload(db, cart)


def add_item(db: Session, customer_id: int, product_id: int, quantity: int) -> dict:
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = get_or_create_cart(db, customer_id)

    existing_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        .first()
    )

    if existing_item is not None:
        new_quantity = existing_item.quantity + quantity
        if product.stock_quantity < new_quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        existing_item.quantity = new_quantity
    else:
        if product.stock_quantity < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        existing_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=product.price,
        )
        db.add(existing_item)

    db.flush()
    cart.total_price = _as_decimal(cart.total_price) + (quantity * _as_decimal(existing_item.unit_price))
    db.commit()

    return _build_cart_payload(db, cart)


def remove_item(db: Session, customer_id: int, item_id: int) -> dict:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")

    line_total = item.quantity * _as_decimal(item.unit_price)
    cart.total_price = max(ZERO, _as_decimal(cart.total_price) - line_total)
    db.delete(item)
    db.commit()

    return _build_cart_payload(db, cart)


def update_item_quantity(db: Session, customer_id: int, item_id: int, quantity: int) -> dict:
    if quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")

    current_quantity = item.quantity
    unit_price = _as_decimal(item.unit_price)

    if quantity == 0:
        cart.total_price = max(ZERO, _as_decimal(cart.total_price) - (current_quantity * unit_price))
        db.delete(item)
        db.commit()
        return _build_cart_payload(db, cart)

    product = db.query(Product).filter(Product.id == item.product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.stock_quantity < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    quantity_delta = quantity - current_quantity
    item.quantity = quantity
    cart.total_price = max(ZERO, _as_decimal(cart.total_price) + (quantity_delta * unit_price))
    db.commit()

    return _build_cart_payload(db, cart)


def get_cart_total(db: Session, customer_id: int) -> float:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        return 0.0
    return float(cart.total_price)


def _build_cart_payload(db: Session, cart: Cart) -> dict:
    rows = _get_cart_item_rows(db, cart.id)
    return {"cart": cart, "items": rows}

def _get_cart_item_rows(db: Session, cart_id: int):
    return (
        db.query(CartItem, Product.name)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart_id)
        .order_by(CartItem.id.asc())
        .all()
    )

def _as_decimal(value) -> Decimal:
    if value is None:
        return ZERO
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))
