from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = "customer"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name     = Column(String(120), nullable=False)
    email         = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    phone         = Column(String(20), nullable=True)
    address       = Column(Text, nullable=True)
    city          = Column(String(100), nullable=True)
    created_at    = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at    = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)