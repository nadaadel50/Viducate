from pydantic import BaseModel, field_validator
from typing import List, Optional


class SubTopicSchema(BaseModel):
    name: str
    description: str
    start_time: int
    end_time: int