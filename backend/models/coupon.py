from sqlalchemy import Column, BigInteger, String, Numeric, Integer, Boolean, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from database import Base

class Coupon(Base):
    __tablename__ = "coupon"

    id               = Column(BigInteger, primary_key=True, index=True)
    code             = Column(String(50), unique=True, nullable=False)
    discount_type    = Column(String(20), nullable=False)
    discount_value   = Column(Numeric(10, 2), nullable=False)
    min_order_amount = Column(Numeric(10, 2), default=0.00)
    max_usage        = Column(Integer, nullable=True)
    times_used       = Column(Integer, nullable=False, default=0)
    is_active        = Column(Boolean, nullable=False, default=True)
    valid_from       = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    valid_until      = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at       = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("discount_value > 0", name="ck_coupon_discount_value"),
        CheckConstraint("discount_type IN ('percentage', 'fixed')", name="ck_coupon_discount_type"),
    )