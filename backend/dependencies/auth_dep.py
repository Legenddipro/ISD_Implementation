from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session

from database import get_db
from models.customer import Customer


def get_current_user(
    db: Session = Depends(get_db),
    x_customer_id: int | None = Header(None),
) -> Customer:
    if x_customer_id is None:
        raise HTTPException(status_code=401, detail="Missing X-Customer-Id header")

    customer = db.query(Customer).filter(Customer.id == x_customer_id).first()
    if customer is None:
        raise HTTPException(status_code=401, detail="Customer not found")

    return customer
