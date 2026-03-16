<<<<<<< HEAD
from app.db.database import SessionLocal

# Provides a DB session per request and automatically closes session after request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
=======
from app.db.database import SessionLocal

# Provides a DB session per request and automatically closes session after request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
>>>>>>> ea2eccd1902d1373bc6459370a0bb36d301c8d77
