from sqlalchemy import Column, Boolean, Integer, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from database import Base

class EggClubMembership(Base):
    __tablename__ = "eggclub_membership"

    id                   = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id          = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), unique=True, nullable=False)
    is_active            = Column(Boolean, nullable=False, default=True)
    free_deliveries_left = Column(Integer, nullable=False, default=0)
    membership_start     = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    membership_end       = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at           = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at           = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("free_deliveries_left >= 0", name="ck_eggclub_free_deliveries"),
    )