from pydantic import BaseModel, HttpUrl, field_validator
from typing import List, Optional, Literal
from datetime import datetime



class VideoUploadURLRequest(BaseModel):
    url: str
    title: str
    language: Optional[Literal["en", "ar"]] = "en"
    subject: Optional[str] = None
    subject: Optional[str] = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        return v

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError("Title must be at least 2 characters")
        return v.strip()


class VideoUploadFileResponse(BaseModel):
    video_id: int
    title: str
    upload_url: str          # Pre-signed S3 URL for frontend to PUT the file
    s3_key: str
    processing_status: str
    message: str


class VideoURLResponse(BaseModel):
    video_id: int
    title: str
    url: str
    language: str
    processing_status: str
    duration: Optional[int] = None
    message: str


class VideoStatusResponse(BaseModel):
    video_id: int
    title: str
    processing_status: str
    upload_date: Optional[datetime]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class VideoResponse(BaseModel):
    video_id: int
    title: str
    url: Optional[str]
    language: str
    duration: Optional[int] = None
    processing_status: str
    upload_date: Optional[datetime]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class PresignedUploadRequest(BaseModel):
    filename: str
    title: str
    language: Optional[Literal["en", "ar"]] = "en"
    subject: Optional[str] = None
    content_type: Optional[str] = "video/mp4"
    file_size: int  

    @field_validator("filename")
    @classmethod
    def validate_filename(cls, v):
        allowed_extensions = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"}
        ext = "." + v.rsplit(".", 1)[-1].lower() if "." in v else ""
        if ext not in allowed_extensions:
            raise ValueError(f"File type not allowed. Allowed: {', '.join(allowed_extensions)}")
        return v
    
    @field_validator("file_size")
    @classmethod
    def validate_file_size(cls, v):
        if v <= 0:
            raise ValueError("File size must be greater than 0")
        max_single_file = 1 * 1024 * 1024 * 1024  # 1 GB
        if v > max_single_file:
            raise ValueError("File size exceeds maximum allowed size of 1GB")
        return v
    


class SaveVideoRequest(BaseModel):
    video_id: int
    completed_segment_ids: List[int] = []
    bookmarks: List[int] = []
    current_time: int = 0
    duration: int = 0 

    @field_validator("current_time")
    @classmethod
    def validate_current_time(cls, v):
        if v < 0:
            raise ValueError("current_time must be greater than or equal to 0")
        return v