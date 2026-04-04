from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models.customer import Customer
from services.auth_service import (
    get_current_customer_by_token,
    get_current_customer_id_from_token,
)


bearer_scheme = HTTPBearer(auto_error=False)


def _extract_bearer_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return credentials.credentials


def get_current_customer_id(
    token: str = Depends(_extract_bearer_token),
) -> int:
    return get_current_customer_id_from_token(token)


def get_current_user(
    token: str = Depends(_extract_bearer_token),
    db: Session = Depends(get_db),
) -> Customer:
    return get_current_customer_by_token(db, token)
