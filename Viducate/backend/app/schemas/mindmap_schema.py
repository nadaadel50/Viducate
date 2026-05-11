from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MindmapNode(BaseModel):
    id:    str
    label: str
    type:  Optional[str] = "default"   # "root" | "segment" | "subtopic" | "keypoint"


class MindmapEdge(BaseModel):
    id:     str
    source: str
    target: str


class MindmapResponse(BaseModel):
    video_id:   int
    title:      str
    language:   Optional[str] = None
    cached:     bool          = False
    nodes:      List[MindmapNode]
    edges:      List[MindmapEdge]
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}