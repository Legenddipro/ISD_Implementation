import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.customer import Customer
from schemas.auth import LoginRequest, RegisterRequest


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def get_customer_by_email(db: Session, email: str) -> Optional[Customer]:
    normalized_email = email.strip().lower()
    return db.query(Customer).filter(Customer.email == normalized_email).first()


def hash_password(password: str) -> str:
    if not password or not password.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be empty",
        )
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not plain_password or not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(customer: Customer) -> str:
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication is not configured properly",
        )

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(customer.id),
        "email": customer.email,
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication is not configured properly",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return payload


def get_current_customer_id_from_token(token: str) -> int:
    payload = decode_access_token(token)
    customer_id = payload.get("sub")

    try:
        return int(customer_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        ) from exc


def register_customer(db: Session, payload: RegisterRequest) -> Customer:
    existing_customer = get_customer_by_email(db, payload.email)
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    try:
        customer = Customer(
            full_name=payload.full_name.strip(),
            email=payload.email.strip().lower(),
            password_hash=hash_password(payload.password),
            phone=payload.phone,
            address=payload.address,
            city=payload.city,
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        ) from exc
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create customer account",
        ) from exc

    return customer


def authenticate_customer(db: Session, payload: LoginRequest) -> Customer:
    customer = get_customer_by_email(db, payload.email)
    if not customer or not verify_password(payload.password, customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return customer


def login_customer(db: Session, payload: LoginRequest) -> dict:
    customer = authenticate_customer(db, payload)
    access_token = create_access_token(customer)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": customer,
    }


def get_current_customer_by_token(db: Session, token: str) -> Customer:
    customer_id = get_current_customer_id_from_token(token)

    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer
