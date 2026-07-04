import logging
from fastapi import APIRouter, Depends, BackgroundTasks, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException
from sqlalchemy.orm import Session


from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.video_service import VideoService
from app.services.processing_service import run_processing_pipeline
from app.schemas.video import (
    SaveVideoRequest,
    VideoUploadURLRequest,
    VideoURLResponse,
    VideoUploadFileResponse,
    VideoStatusResponse,
    VideoResponse,
    PresignedUploadRequest,
)
from app.repositories.video_repository import VideoRepository
from app.services.processing_service import ProcessingJobService


router = APIRouter(prefix="/videos", tags=["Videos"])
logger = logging.getLogger(__name__)
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)


@router.post(
    "/url",
    status_code=status.HTTP_201_CREATED,
    response_model=VideoURLResponse,
    summary="Submit a video URL",
    description=(
        "Submit a publicly accessible video URL (YouTube, Vimeo, direct MP4, etc.). "
        "The video metadata is saved and processing is queued immediately."
    ),
)
async def submit_video_url(
    request: VideoUploadURLRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    result =await  service.submit_url(current_user.id, request)
    if result.get("cached"):
        return result  
    

    background_tasks.add_task(
        run_processing_pipeline,
        video_id=result["video_id"],
        language=result["language"],
    )

    logger.info(f"URL video submitted: video_id={result['video_id']}, user={current_user.id}")
    return result



@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=VideoUploadFileResponse,
    summary="Request presigned S3 upload URL",
    description=(
        "Returns a presigned PUT URL valid for 1 hour. "
        "The frontend uploads the video file directly to S3 using this URL, "
        "then calls POST /videos/{video_id}/confirm to start processing."
    ),
)
def request_file_upload(
    request: PresignedUploadRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    result = service.request_file_upload(current_user.id, request)
    logger.info(f"Presigned URL issued: video_id={result['video_id']}, user={current_user.id}")
    return result


@router.post(
    "/{video_id}/confirm",
    status_code=status.HTTP_200_OK,
    summary="Confirm file upload and start processing",
    description=(
        "Call this after the frontend finishes uploading the file to S3. "
        "The backend verifies the object exists in S3 and queues the processing job."
    ),
)
def confirm_upload(
    video_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    result = service.confirm_upload(current_user.id, video_id)

    from app.repositories.video_repository import VideoRepository
    video = VideoRepository(db).get_by_id(video_id)

    background_tasks.add_task(
        run_processing_pipeline,
        video_id=video_id,
        language=video.language,
    )

    logger.info(f"Upload confirmed, pipeline started: video_id={video_id}, user={current_user.id}")
    return result


@router.get(
    "/{video_id}/status",
    response_model=VideoStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get video processing status",
    description="Poll this endpoint to check if processing has completed.",
)
def get_video_status(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    return service.get_video_status(current_user.id, video_id)


@router.get(
    "",
    response_model=list[VideoResponse],
    status_code=status.HTTP_200_OK,
    summary="List my videos",
    description="Returns all videos uploaded by the authenticated user.",
)
def list_my_videos(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    return service.get_user_videos(current_user.id)


@router.delete(
    "/{video_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a video",
    description="Deletes the video record from DB and the file from S3 (if applicable).",
)
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    return service.delete_video(current_user.id, video_id)
    

@router.post(
    "/{video_id}/save",
    status_code=status.HTTP_200_OK,
    summary="Save video progress",
    description="Save completed segments, bookmarks, and current time for a video.",
)
def save_video(
    video_id: int,
    request: SaveVideoRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VideoService(db)
    return service.save_video(current_user.id, request)




@router.post(
    "/{video_id}/cancel",
    status_code=status.HTTP_200_OK,
    summary="Cancel a running video analysis pipeline",
    description=(
        "Stops an in-progress analysis (transcription / OCR / segmentation) "
        "and deletes all partial data (segments, subtopics, keypoints, etc.) "
        "as well as the video record itself.  "
        "Returns 400 if the pipeline has already finished."
    ),
)
def cancel_video_analysis(
    video_id: int,
    background_tasks: BackgroundTasks,         
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    job_service = ProcessingJobService(db)
    result = job_service.cancel_job(video_id, current_user.id)
    if not result["cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"],
        )
    logger.info(
        f"Analysis cancelled | video_id={video_id} | user={current_user.id}"
    )
    return result