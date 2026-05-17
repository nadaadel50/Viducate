from pydantic import BaseModel
from typing import List, Optional, Literal, Union
from datetime import datetime
from app.schemas.summary_schema import ReadingTime

class TermBlock(BaseModel):
    text: str
    type: Literal["term"]
    tooltip: str


class NormalBlock(BaseModel):
    text: str
    type: Literal["normal"]


class ImportantBlock(BaseModel):
    text: str
    type: Literal["important"]
    tooltip: Optional[str] = None


ExplanationBlock = Union[TermBlock, ImportantBlock, NormalBlock]

class Definition(BaseModel):
    term: str
    meaning: str


class Table(BaseModel):
    title: str
    headers: List[str]
    rows: List[List[str]]


class StudyNotesSection(BaseModel):
    heading: str
    explanation: List[ExplanationBlock]
    definitions: Optional[List[Definition]] = []
    examples: Optional[List[str]] = []
    tables: Optional[List[Table]] = []
    notes: Optional[List[str]] = []

class StudyNotesContent(BaseModel):
    title: str
    introduction: str
    sections: List[StudyNotesSection]


class VideoStudyNotesResponse(BaseModel):
    video_id: int
    language: Optional[str] = None
    cached: bool = False
    study_notes: Optional[StudyNotesContent] = None
    created_at: Optional[datetime] = None
    reading_time: Optional[ReadingTime] = None

    model_config = {"from_attributes": True}


class SegmentStudyNotesResponse(BaseModel):
    segment_id: int
    segment_number: int
    title: str
    start_time: int
    end_time: int
    language: Optional[str] = None
    study_notes: Optional[StudyNotesContent] = None
    generation_failed: bool = False
    reading_time: Optional[ReadingTime] = None

    model_config = {"from_attributes": True}