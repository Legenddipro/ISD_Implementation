from sqlalchemy import Column, Numeric, Integer, TIMESTAMP, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.sql import func
from database import Base

class Cart(Base):
    __tablename__ = "cart"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    created_at  = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at  = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("total_price >= 0", name="ck_cart_total_price"),
    )


class CartItem(Base):
    __tablename__ = "cart_item"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cart_id    = Column(Integer, ForeignKey("cart.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False)
    quantity   = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("cart_id", "product_id", name="uq_cart_product"),
        CheckConstraint("quantity > 0", name="ck_cart_item_quantity"),
        CheckConstraint("unit_price >= 0", name="ck_cart_item_unit_price"),
    )