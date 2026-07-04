from pydantic import BaseModel, field_validator
from typing import List, Optional

from app.schemas.subtopic_schema import SubTopicSchema


class SegmentFullSchema(BaseModel):
    video_id: int 
    segment_number: int
    start_time: int
    end_time: int
    main_topic: str
    title: str

    sub_topics: List[SubTopicSchema]  
    key_points: Optional[List[str]] = []



    @field_validator("segment_number")
    @classmethod
    def validate_segment_number(cls, v):
        if v < 1:
            raise ValueError("segment_number must be >= 1")
        return v

    @field_validator("title", "main_topic")
    @classmethod
    def validate_text(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError("Text must be at least 3 characters")
        return v.strip()

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time(cls, v):
        if v < 0:
            raise ValueError("Time must be non-negative")
        return v

    @field_validator("end_time")
    @classmethod
    def validate_time_range(cls, v, info):
        start_time = info.data.get("start_time")
        if start_time is not None and v <= start_time:
            raise ValueError("end_time must be greater than start_time")
        return v
    


class SegmentCreate(BaseModel):
    video_id: int
    segment_number: int
    start_time: int
    end_time: int
    main_topic: str
    title: str
