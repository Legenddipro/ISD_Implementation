from sqlalchemy import Column, BigInteger, String, Numeric, Boolean, Text, Integer, TIMESTAMP, ForeignKey, Index, CheckConstraint
from sqlalchemy.sql import func
from database import Base

class Order(Base):
    __tablename__ = "order"

    id                 = Column(BigInteger, primary_key=True, index=True)
    customer_id        = Column(BigInteger, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False)
    coupon_id          = Column(BigInteger, ForeignKey("coupon.id", ondelete="SET NULL"), nullable=True)
    subtotal           = Column(Numeric(10, 2), nullable=False)
    discount_amount    = Column(Numeric(10, 2), nullable=False, default=0.00)
    delivery_charge    = Column(Numeric(10, 2), nullable=False, default=0.00)
    total_amount       = Column(Numeric(10, 2), nullable=False)
    delivery_address   = Column(Text, nullable=False)
    delivery_city      = Column(String(100), nullable=True)
    delivery_time      = Column(TIMESTAMP(timezone=True), nullable=True)
    delivery_type      = Column(String(50), default="standard")
    payment_method     = Column(String(50), default="cod")
    status             = Column(String(30), nullable=False, default="pending")
    used_free_delivery = Column(Boolean, nullable=False, default=False)
    created_at         = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at         = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("subtotal >= 0", name="ck_order_subtotal"),
        CheckConstraint("total_amount >= 0", name="ck_order_total_amount"),
        CheckConstraint(
            "status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')",
            name="ck_order_status"
        ),
    )


class OrderItem(Base):
    __tablename__ = "order_item"

    id         = Column(BigInteger, primary_key=True, index=True)
    order_id   = Column(BigInteger, ForeignKey("order.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("product.id", ondelete="CASCADE"), nullable=False)
    quantity   = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_order_item_quantity"),
        CheckConstraint("unit_price >= 0", name="ck_order_item_unit_price"),
    )


class Shipment(Base):
    __tablename__ = "shipment"

    id                 = Column(BigInteger, primary_key=True, index=True)
    order_id           = Column(BigInteger, ForeignKey("order.id", ondelete="CASCADE"), unique=True, nullable=False)
    tracking_number    = Column(String(100), nullable=True)
    status             = Column(String(30), nullable=False, default="pending")
    estimated_delivery = Column(TIMESTAMP(timezone=True), nullable=True)
    shipped_at         = Column(TIMESTAMP(timezone=True), nullable=True)
    delivered_at       = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at         = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at         = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'dispatched', 'in_transit', 'delivered', 'returned')",
            name="ck_shipment_status"
        ),
    )


# Indexes
idx_order_customer = Index("idx_order_customer", "customer_id")
idx_shipment_order = Index("idx_shipment_order", "order_id")