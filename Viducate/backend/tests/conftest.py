import os
import sys

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

# import pytest
# from dotenv import load_dotenv
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from fastapi.testclient import TestClient

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# load_dotenv()  #.env

# from app.main import app
# from app.dependencies import get_db
# from app.models.base import Base


# from app.models.user import User

# TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
# if not TEST_DATABASE_URL:
#     raise ValueError("TEST_DATABASE_URL not set in .env")

# engine = create_engine(TEST_DATABASE_URL, future=True)
# TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# @pytest.fixture(scope="session", autouse=True)
# def setup_test_database():
#     Base.metadata.create_all(bind=engine)
#     yield
#     Base.metadata.drop_all(bind=engine)


# @pytest.fixture(scope="function")
# def db_session():
#     connection = engine.connect()
#     transaction = connection.begin()
#     session = TestingSessionLocal(bind=connection)
#     yield session
#     session.close()
#     transaction.rollback()  
#     connection.close()


# @pytest.fixture(scope="function")
# def client(db_session):
#     def override_get_db():
#         try:
#             yield db_session
#         finally:
#             pass

#     app.dependency_overrides[get_db] = override_get_db
#     with TestClient(app) as c:
#         yield c
#     app.dependency_overrides.clear()

