from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional

class SearchRequest(BaseModel):
    query: str