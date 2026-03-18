from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator

try:
    from pydantic import ConfigDict
except ImportError:  # Pydantic v1 fallback
    ConfigDict = None


class AuthBase(BaseModel):
    email: EmailStr

    @validator("email")
    def normalize_email(cls, value: EmailStr) -> str:
        return value.strip().lower()


class RegisterRequest(AuthBase):
    full_name: str = Field(..., min_length=2, max_length=120)
    password: str = Field(..., min_length=8, max_length=72)
    phone: Optional[str] = Field(default=None, max_length=20)
    address: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None, max_length=100)

    @validator("full_name")
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("full_name cannot be empty")
        return value

    @validator("password")
    def validate_password(cls, value: str) -> str:
        value = value.strip()
        if " " in value:
            raise ValueError("password must not contain spaces")
        return value

    @validator("phone", "address", "city")
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        return value or None


class LoginRequest(AuthBase):
    password: str = Field(..., min_length=8, max_length=72)

    @validator("password")
    def validate_password(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("password cannot be empty")
        return value


class AuthUserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    if ConfigDict is not None:
        model_config = ConfigDict(from_attributes=True)
    else:
        class Config:
            orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse


class RegisterResponse(BaseModel):
    message: str = "Registration successful"
    user: AuthUserResponse
