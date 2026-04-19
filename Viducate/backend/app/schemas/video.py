from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, Literal
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

    @field_validator("filename")
    @classmethod
    def validate_filename(cls, v):
        allowed_extensions = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"}
        ext = "." + v.rsplit(".", 1)[-1].lower() if "." in v else ""
        if ext not in allowed_extensions:
            raise ValueError(f"File type not allowed. Allowed: {', '.join(allowed_extensions)}")
        return v