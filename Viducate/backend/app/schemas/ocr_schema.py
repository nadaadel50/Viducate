from pydantic import BaseModel
from typing import List, Optional


class OCRTriggerRequest(BaseModel):
    video_id: int


class OCRSegment(BaseModel):
    time:        float
    timestamp:   str
    text:        str
    lines:       Optional[List[str]] = []
    frame_index: Optional[int]       = None
    line_count:  Optional[int]       = None


class OCRResponse(BaseModel):
    video_id:  int
    status:    str
    segments:  List[OCRSegment]
    total:     int
    language:  Optional[str] = None
    url_type:  Optional[str] = None
