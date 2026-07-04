from datetime import datetime

from pydantic import BaseModel, field_validator
from typing import List, Optional




class SegmentSchema(BaseModel):
    video_id: int 
    segment_number: int
    start_time: int
    end_time: int
    main_topic: str
    title: str
    
    class Config:
        from_attributes = True
    

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


class SubTopicBriefResponse(BaseModel):
    name: str
    start_time: int

    model_config = {"from_attributes": True}


class SegmentResponse(BaseModel):
    segment_id: int
    segment_number: int
    start_time: int
    end_time: int
    main_topic: str
    title: str
    is_completed:bool
    sub_topics: list[SubTopicBriefResponse] = []
    
    quality_score:  Optional[float] = None
    quality_flag:   Optional[bool]  = None
    retry_count:    Optional[int]   = None
    

    model_config = {"from_attributes": True}


class VideoSegmentsResponse(BaseModel):
    video_id: int
    title:str
    video_url: Optional[str]
    current_time: int
    last_watched_at: Optional[datetime]
    bookmarks: List[int]
    segments: List[SegmentResponse]



class SegmentQualityItem(BaseModel):
    segment_id:     int
    segment_number: int
    title:          str
    quality_score:  Optional[float]
    quality_flag:   Optional[bool]
    retry_count:    Optional[int]
    model_config = {"from_attributes": True}


class VideoQualityResponse(BaseModel):
    video_id:           int
    total_segments:     int
    flagged_segments:   int
    average_score:      Optional[float]
    segments:           List[SegmentQualityItem]
