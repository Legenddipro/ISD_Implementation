from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Category(Base):
    __tablename__ = "category"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)