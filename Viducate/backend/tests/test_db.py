# # cd backend\tests python test_db.py

# from sqlalchemy import create_engine, text
# from dotenv import load_dotenv
# import os

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")

# print(f"Connecting to: {DATABASE_URL}")

# engine = create_engine(DATABASE_URL)

# def insert_user(conn):
#     try:
#         query = text("""
#             INSERT INTO "user" (first_name, last_name, email, password, study_field, educational_level, language_preference)
#             VALUES (:first, :last, :email, :password, :field, :level, :lang)
#             RETURNING id;""")

#         result = conn.execute(query, {
#             "first": "Menna",
#             "last": "Essam",
#             "email": "menaesam" + os.urandom(2).hex() + "@viducate.com",  # random email to avoid duplicates
#             "password": "12345",
#             "field": "Computer Science",
#             "level": "Bachelor",
#             "lang": "en"
#         })

#         new_id = result.scalar()
#         print(f"User inserted with ID: {new_id}")

#     except Exception as e:
#         print(f"Insert failed: {e}")

# try:
    
#     with engine.begin() as conn:
#         result = conn.execute(text('SELECT COUNT(*) FROM "user"'))
#         count = result.scalar()
#         print("Connected successfully!")
#         print(f" Current users in database: {count}")

#         print("\nInserting new user...")
#         insert_user(conn)

#         result = conn.execute(text('SELECT COUNT(*) FROM "user"'))
#         print(f"Updated user count: {result.scalar()}")

#         result = conn.execute(text("""
#             SELECT table_name 
#             FROM information_schema.tables 
#             WHERE table_schema = 'public' 
#             ORDER BY table_name
#         """))
        
#         print("\n Tables in database:")
#         for row in result:
#             print(f"  - {row[0]}")

# except Exception as e:
#     print(f"Connection failed: {e}")


from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

Base = declarative_base()

Base.metadata.drop_all(bind=engine)
print("All tables dropped successfully!")
