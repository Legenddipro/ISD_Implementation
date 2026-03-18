from sqlalchemy import Column, String, Text, Numeric, Integer, TIMESTAMP, ForeignKey, Index,CheckConstraint
from sqlalchemy.sql import func
from database import Base

class Product(Base):
    __tablename__ = "product"

    id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name           = Column(String(255), nullable=False)
    description    = Column(Text, nullable=True)
    price          = Column(Numeric(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    image_url      = Column(Text, nullable=True)
    category_id    = Column(Integer, ForeignKey("category.id", ondelete="SET NULL"), nullable=True)
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at     = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    __table_args__ = (
    CheckConstraint("price >= 0", name="ck_product_price"),
    CheckConstraint("stock_quantity >= 0", name="ck_product_stock"),
)

# Indexes
idx_product_name     = Index("idx_product_name", "name")
idx_product_category = Index("idx_product_category", "category_id")