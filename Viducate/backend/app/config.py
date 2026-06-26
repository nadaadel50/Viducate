import os
from dotenv import load_dotenv
from pydantic import EmailStr

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")

    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: EmailStr = os.getenv("MAIL_FROM")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", 587))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER")
    MAIL_STARTTLS: bool = os.getenv("MAIL_TLS", "True").lower() == "true"
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL", "False").lower() == "true"
    USE_CREDENTIALS: bool = os.getenv("USE_CREDENTIALS", "True").lower() == "true"

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI")

    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_S3_ENDPOINT: str = os.getenv("SUPABASE_S3_ENDPOINT")    
    SUPABASE_S3_ACCESS_KEY: str = os.getenv("SUPABASE_S3_ACCESS_KEY")
    SUPABASE_S3_SECRET_KEY: str = os.getenv("SUPABASE_S3_SECRET_KEY")
    SUPABASE_REGION: str = os.getenv("SUPABASE_REGION", "ap-southeast-1")
    SUPABASE_BUCKET_NAME: str = os.getenv("SUPABASE_BUCKET_NAME", "viducate-videos")
    SUPABASE_BUCKET_PUBLIC: bool = os.getenv("SUPABASE_BUCKET_PUBLIC", "false").lower() == "true"

    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID")
    R2_ACCESS_KEY: str = os.getenv("R2_ACCESS_KEY")
    R2_SECRET_KEY: str = os.getenv("R2_SECRET_KEY")
    R2_BUCKET_NAME: str = os.getenv("R2_BUCKET_NAME", "viducate")
    R2_PUBLIC_URL: str = os.getenv("R2_PUBLIC_URL", "")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    GROQ_API_KEY_segments: str = os.getenv("GROQ_API_KEY_segments")

    Youtube_API_KEY: str = os.getenv("Youtube_API_KEY")
settings = Settings()
  