from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.cart import Cart, CartItem
from models.product import Product


def get_or_create_cart(db: Session, customer_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        cart = Cart(customer_id=customer_id, total_price=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def get_cart_with_items(db: Session, customer_id: int) -> dict:
    cart = get_or_create_cart(db, customer_id)
    rows = (
        db.query(CartItem, Product.name)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )
    return {"cart": cart, "items": rows}


def add_item(db: Session, customer_id: int, product_id: int, quantity: int) -> dict:
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.stock_quantity < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

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
        new_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=product.price,
        )
        db.add(new_item)

    db.flush()
    _recalculate_total(db, cart)
    db.commit()

    return get_cart_with_items(db, customer_id)


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

    db.delete(item)
    db.flush()
    _recalculate_total(db, cart)
    db.commit()

    return get_cart_with_items(db, customer_id)


def get_cart_total(db: Session, customer_id: int) -> float:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if cart is None:
        return 0.0
    return float(cart.total_price)


def _recalculate_total(db: Session, cart: Cart) -> None:
    items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    total = sum(item.quantity * item.unit_price for item in items)
    cart.total_price = total
