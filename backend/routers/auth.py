from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth_dep import get_current_user
from models.customer import Customer
from schemas.auth import AuthUserResponse, LoginRequest, RegisterRequest, RegisterResponse, TokenResponse
from services.auth_service import login_customer, register_customer


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer account",
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    customer = register_customer(db, payload)
    return {
        "message": "Registration successful",
        "user": customer,
    }


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate a customer and return an access token",
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    return login_customer(db, payload)


@router.get(
    "/me",
    response_model=AuthUserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get the current authenticated customer",
)
def get_me(current_user: Customer = Depends(get_current_user)):
    return current_user
