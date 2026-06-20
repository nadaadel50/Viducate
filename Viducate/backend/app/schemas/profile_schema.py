from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
import re


# User Update Profile Request
class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

    # Name length validation
    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value):
        if value and len(value.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return value.strip() if value else value

    # Password strength validation
    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value):
        if not value:  
          return None
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number")
        return value
    

    @model_validator(mode="after")
    def validate_password_change(self):
        if not self.new_password:
          self.current_password = None
          self.new_password = None
          return self
        
        if not self.current_password:
          raise ValueError("Current password is required to change password")
        return self
