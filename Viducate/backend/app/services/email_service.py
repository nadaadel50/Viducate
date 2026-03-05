# app/services/email_service.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from app.config import settings

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
        print(f"Email failed: {e}")