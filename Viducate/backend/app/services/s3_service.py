import boto3
import uuid
import logging
from botocore.exceptions import ClientError
from typing import Optional

from fastapi import HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)


class S3Service:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY,
            aws_secret_access_key=settings.R2_SECRET_KEY,
            region_name="auto",
        )
        self.bucket = settings.R2_BUCKET_NAME

    def generate_s3_key(self, user_id: int, filename: str) -> str:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "mp4"
        unique_id = uuid.uuid4().hex
        return f"videos/{user_id}/{unique_id}.{ext}"

    def generate_presigned_upload_url(
        self,
        s3_key: str,
        content_type: str = "video/mp4",
        expires_in: int = 3600,
    ) -> Optional[str]:
        try:
            url = self.client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": self.bucket,
                    "Key": s3_key,
                    "ContentType": content_type,
                },
                ExpiresIn=expires_in,
            )
            logger.info(f"Generated presigned upload URL for key: {s3_key}")
            return url
        except ClientError as e:
            logger.error(f"Failed to generate presigned upload URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate upload URL"
            )

    def generate_presigned_download_url(
        self,
        s3_key: str,
        expires_in: int = 3600,
    ) -> Optional[str]:
        try:
            url = self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": s3_key},
                ExpiresIn=expires_in,
            )
            return url
        except ClientError as e:
            logger.error(f"Failed to generate presigned download URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate download URL"
            )

    def get_public_url(self, s3_key: str) -> str:
        if settings.R2_PUBLIC_URL:
            return f"{settings.R2_PUBLIC_URL.rstrip('/')}/{s3_key}"
        return self.generate_presigned_download_url(s3_key)

    def object_exists(self, s3_key: str) -> bool:
        try:
            self.client.head_object(Bucket=self.bucket, Key=s3_key)
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                return False
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to check object existence: {s3_key}"
            )

    def delete_object(self, s3_key: str) -> bool:
        try:
            self.client.delete_object(Bucket=self.bucket, Key=s3_key)
            logger.info(f"Deleted R2 object: {s3_key}")
            return True
        except ClientError as e:
            logger.error(f"Failed to delete R2 object {s3_key}: {e}")
            return False