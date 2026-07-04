from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re
from typing import Literal

def validate_password_strength(value: str):
    if len(value) < 8:
        raise ValueError("Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", value):
        raise ValueError("Password must contain at least one uppercase letter")

    if not re.search(r"[0-9]", value):
        raise ValueError("Password must contain at least one number")

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", value):
        raise ValueError("Password must contain at least one special character")

    return value

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
        return validate_password_strength(value)

    # Name length validation
    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value):
        if value is None:
            return value
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Name must be at least 2 characters")
        return value

    # Language validation
    @field_validator("language_preference")
    @classmethod
    def validate_language(cls, value):
        allowed = ["ar", "en"]
        if value and value not in allowed:
            raise ValueError(f"language_preference must be one of: {allowed}")
        return value



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


class UserProfileResponse(UserResponse):
    has_password: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse



class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
    token: TokenResponse


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


#Forget Password 
class ForgetPasswordRequest(BaseModel):
    email:EmailStr

class ForgetPasswordResponse(BaseModel):
    message: str

class ResetPasswordRequest(BaseModel):
    token:str
    new_password:str
    confirm_password:str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value):
        return validate_password_strength(value)
    
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v

class ResetPasswordResponse(BaseModel):
    message: str


class UpdateLanguageRequest(BaseModel):
    language: Literal["en", "ar"]


