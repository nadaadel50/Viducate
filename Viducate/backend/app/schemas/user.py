from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re


# User Request
class UserRegisterRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr                       
    password: str
    study_field: Optional[str] = None
    language_preference: Optional[str] = None

    # Password strength validation
    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number")
        return value

    # Name length validation
    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value):
        if value and len(value.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return value.strip() if value else value

    # Language validation
    @field_validator("language_preference")
    @classmethod
    def validate_language(cls, value):
        allowed = ["ar", "en"]
        if value and value not in allowed:
            raise ValueError(f"language_preference must be one of: {allowed}")
        return value


#  System Response 
class UserResponse(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    study_field: Optional[str]
    language_preference: Optional[str]
    account_status: Optional[str]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}  


# Token Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Registration Response 
class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
    token: TokenResponse


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str