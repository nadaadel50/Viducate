from fastapi import HTTPException , status
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from app.config import settings
from app.services.network_errors import is_network_error

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,        
    MAIL_SSL_TLS=False,       
    USE_CREDENTIALS=True,
)

async def send_reset_email(to_email: EmailStr, reset_url: str):
    message = MessageSchema(
        subject="Password Reset - Viducate",
        recipients=[to_email],
        body=f"""
        <p>Hello,</p>
        <p>You requested to reset your password for <b>Viducate</b>.</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <a href="{reset_url}">{reset_url}</a>
        <p>If you didn't request this, ignore this email.</p>
        <p>Viducate Team</p>
        """,
        subtype="html"
    )
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        
    except Exception as e:
        detail = (
            "Could not send email — network connection issue. Please try again."
            if is_network_error(e)
            else "Failed to send reset email. Please try again later."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE if is_network_error(e)
            else status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )