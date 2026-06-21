# from unittest.mock import patch, AsyncMock
# from app.models.user import User

# # ============ Helper: User Data ============
# BASE_URL = "/api/v1/auth"

# def valid_user_payload(email="Menna@gmail.com"):
#     return {
#         "first_name": "Menna",
#         "last_name": "Mohamed",
#         "email": email,
#         "password": "Menna12345_",
#         "study_field": "Computer Science",
#         "language_preference": "en"
#     }

# # ===================== REGISTER =====================

# def test_register_success(client):
#     response = client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     assert response.status_code == 201
#     data = response.json()
#     assert data["user"]["email"] == "Menna@gmail.com"
#     assert "token" in data
#     assert data["token"]["access_token"] is not None
#     assert "password" not in data["user"]



# def test_register_duplicate_email_fails(client):
#     client.post(f"{BASE_URL}/register", json=valid_user_payload())
#     response = client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     assert response.status_code == 409
#     assert response.json()["detail"] == "An account with this email already exists"


# def test_register_missing_required_field_fails(client):
#     payload = valid_user_payload()
#     del payload["email"]

#     response = client.post(f"{BASE_URL}/register", json=payload)
#     assert response.status_code == 422


# def test_register_invalid_email_format_fails(client):
#     payload = valid_user_payload()
#     payload["email"] = "mennaessam" #not email

#     response = client.post(f"{BASE_URL}/register", json=payload)
#     assert response.status_code == 422


# # ===================== LOGIN =====================

# def test_login_success(client):
#     client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     response = client.post(f"{BASE_URL}/login", json={
#         "email": "Menna@gmail.com",
#         "password": "Menna12345_"
#     })

#     assert response.status_code == 200
#     data = response.json()
#     assert data["access_token"] is not None
#     assert data["user"]["email"] == "Menna@gmail.com"


# def test_login_wrong_password_fails(client):
#     client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     response = client.post(f"{BASE_URL}/login", json={
#         "email": "Menna@gmail.com",
#         "password": "menna123_"
#     })

#     assert response.status_code == 401


# def test_login_nonexistent_email_fails(client):
#     #not register before
#     response = client.post(f"{BASE_URL}/login", json={
#         "email": "sara@example.com",
#         "password": "Menna12345_"
#     })

#     assert response.status_code == 401


# def test_login_locks_account_after_5_failed_attempts(client):
#     client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     for _ in range(5):
#         client.post(f"{BASE_URL}/login", json={
#             "email": "Menna@gmail.com",
#             "password": "menna123_"
#         })

# # Sixth attempt - Even if the password is correct, you must reject it because the account has been locked    
#     response = client.post(f"{BASE_URL}/login", json={
#         "email": "Menna@gmail.com",
#         "password": "Menna12345_"
#     })

#     assert response.status_code == 403

    
# # ===================== GET CURRENT USER (/me) =====================

# def test_get_me_with_valid_token(client):
#     reg = client.post(f"{BASE_URL}/register", json=valid_user_payload())
#     token = reg.json()["token"]["access_token"]

#     response = client.get(f"{BASE_URL}/me", headers={
#         "Authorization": f"Bearer {token}"
#     })

#     assert response.status_code == 200
#     assert response.json()["email"] == "Menna@gmail.com"


# def test_get_me_without_token_fails(client):
#     response = client.get(f"{BASE_URL}/me")
#     assert response.status_code == 401
#     assert response.json()["detail"] == "Not authenticated"  #exist in venv\Lib\site-packages\fastapi\security\http.py


# def test_get_me_with_invalid_token_fails(client):
#     response = client.get(f"{BASE_URL}/me", headers={
#         "Authorization": "Bearer invalid.token"
#     })
#     assert response.status_code == 401
#     assert response.json()["detail"] == "Invalid or expired token"



# # ===================== LOGOUT =====================

# def test_logout_with_valid_token(client):
#     reg = client.post(f"{BASE_URL}/register", json=valid_user_payload())
#     token = reg.json()["token"]["access_token"]

#     response = client.post(f"{BASE_URL}/logout", headers={
#         "Authorization": f"Bearer {token}"
#     })

#     assert response.status_code == 200
#     assert response.json()["message"] == "Logged out successfully"


# def test_logout_with_invalid_token_fails(client):
#     response = client.post(f"{BASE_URL}/logout", headers={
#         "Authorization": "Bearer invalid.token"
#     })
#     assert response.status_code == 401


# # ===================== Forget and Reset Password =====================

# def test_reset_password_success(client, db_session):
#     client.post(f"{BASE_URL}/register", json=valid_user_payload())

#     #Mock because not send actually email
#     with patch("app.services.email_service.send_reset_email", new_callable=AsyncMock):
#         client.post(f"{BASE_URL}/forgot-password", json={"email": "Menna@gmail.com"})

#     #  for taking reset_tokenfrom database
#     user = db_session.query(User).filter_by(email="Menna@gmail.com").first()
#     reset_token = user.reset_token

    
#     response = client.post(f"{BASE_URL}/reset-password", json={
#         "token": reset_token,
#         "new_password": "Menna123456!",
#         "confirm_password":"Menna123456!"
#     })

#     assert response.status_code == 200


# def test_reset_password_invalid_token_fails(client):
#     response = client.post(f"{BASE_URL}/reset-password", json={
#         "token": "token invalid",
#         "new_password": "Menna123456!",
#         "confirm_password": "Menna123456!"
#     })

#     assert response.status_code == 400


# def test_forgot_password_nonexistent_email_fails(client):
#     response = client.post(f"{BASE_URL}/forgot-password", json={
#         "email": "mennnaaaaaaaaaaa@gnail.com"
#     })

#     assert response.status_code == 409
