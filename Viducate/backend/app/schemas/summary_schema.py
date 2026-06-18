from pydantic import BaseModel
from typing import List, Optional, Literal, Union
from datetime import datetime


class TermContent(BaseModel):
    text: str
    type: Literal["term"]
    tooltip: str


class NormalContent(BaseModel):
    text: str
    type: Literal["normal"]
    highlights: Optional[List[str]] = []


SectionContent = Union[
    TermContent,
    NormalContent
]


class Section(BaseModel):
    heading: str
    content: List[SectionContent]


class SummaryContent(BaseModel):
    takeaways: List[str]
    sections: List[Section]
    conclusion: str

class ReadingTime(BaseModel):
    words: int
    minutes: int
    label: str

class SegmentSummaryResponse(BaseModel):
    segment_id: int
    segment_number: int
    title: str
    start_time: int
    end_time: int
    summary: Optional[SummaryContent] = None
    language: Optional[str] = None
    generation_failed: bool = False
    reading_time: Optional[ReadingTime] = None
    model_config = {
        "from_attributes": True
    }


class VideoSummaryResponse(BaseModel):
    video_id: int
    title: str
    summary: Optional[SummaryContent] = None
    language: Optional[str] = None
    created_at: Optional[datetime] = None
    cached: bool = False
    reading_time: Optional[ReadingTime] = None
    model_config = {
        "from_attributes": True
    }