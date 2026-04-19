from app.db.database import SessionLocal

# Provides a DB session per request and automatically closes session after request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
