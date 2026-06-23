"""
Unit tests for app/core/security.py

Covers:
  - hash_password / verify_password (bcrypt)
  - create_access_token / decode_access_token (JWT)

To run these tests: python -m pytest tests/unit/test_security.py -v
"""

import pytest
from datetime import timedelta
from unittest.mock import patch

import app.core.security as security

@pytest.fixture(autouse=True)
def _fixed_settings():
    with patch.object(security.settings, "SECRET_KEY", "unit-test-secret-key"), \
         patch.object(security.settings, "ALGORITHM", "HS256"), \
         patch.object(security.settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 30): yield


# hash_password / verify_password
class TestPasswordHashing:
    def test_hash_password_returns_different_string_than_input(self):
        hashed = security.hash_password("MyPassword123")
        assert hashed != "MyPassword123"

    def test_hash_password_returns_non_empty_string(self):
        hashed = security.hash_password("MyPassword123")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_same_password_hashed_twice_produces_different_hashes(self):
        h1 = security.hash_password("RepeatPassword1")
        h2 = security.hash_password("RepeatPassword1")
        assert h1 != h2

    def test_verify_password_succeeds_with_correct_password(self):
        hashed = security.hash_password("CorrectHorse1")
        assert security.verify_password("CorrectHorse1", hashed) is True

    def test_verify_password_fails_with_wrong_password(self):
        hashed = security.hash_password("CorrectHorse1")
        assert security.verify_password("WrongPassword1", hashed) is False

    def test_verify_password_fails_with_empty_password(self):
        hashed = security.hash_password("CorrectHorse1")
        assert security.verify_password("", hashed) is False

    def test_verify_password_is_case_sensitive(self):
        hashed = security.hash_password("CaseSensitive1")
        assert security.verify_password("casesensitive1", hashed) is False

    def test_hash_password_handles_unicode_input(self):
        hashed = security.hash_password("كلمةمرور123")
        assert security.verify_password("كلمةمرور123", hashed) is True


# create_access_token
class TestCreateAccessToken:
    def test_create_access_token_returns_string(self):
        token = security.create_access_token(data={"sub": "1", "email": "a@b.com"})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_access_token_embeds_provided_data(self):
        token = security.create_access_token(data={"sub": "42", "email": "user@viducate.com"})
        payload = security.decode_access_token(token)
        assert payload["sub"] == "42"
        assert payload["email"] == "user@viducate.com"

    def test_create_access_token_adds_expiry_claim(self):
        token = security.create_access_token(data={"sub": "1"})
        payload = security.decode_access_token(token)
        assert "exp" in payload

    def test_create_access_token_respects_custom_expires_delta(self):
        token = security.create_access_token(
            data={"sub": "1"}, expires_delta=timedelta(minutes=5)
        )
        payload = security.decode_access_token(token)
        assert payload is not None
        assert "exp" in payload

    def test_create_access_token_does_not_mutate_input_dict(self):
        original = {"sub": "1", "email": "a@b.com"}
        security.create_access_token(data=original)
        assert original == {"sub": "1", "email": "a@b.com"}


# decode_access_token
class TestDecodeAccessToken:
    def test_decode_valid_token_returns_payload_dict(self):
        token = security.create_access_token(data={"sub": "7"})
        payload = security.decode_access_token(token)
        assert isinstance(payload, dict)
        assert payload["sub"] == "7"

    def test_decode_garbage_token_returns_none(self):
        assert security.decode_access_token("not-a-real-token") is None

    def test_decode_empty_string_returns_none(self):
        assert security.decode_access_token("") is None

    def test_decode_token_signed_with_different_secret_returns_none(self):
        token = security.create_access_token(data={"sub": "1"})
        with patch.object(security.settings, "SECRET_KEY", "a-different-secret"):
            assert security.decode_access_token(token) is None

    def test_decode_expired_token_returns_none(self):
        token = security.create_access_token(
            data={"sub": "1"}, expires_delta=timedelta(minutes=-1)
        )
        assert security.decode_access_token(token) is None

    def test_decode_token_with_wrong_algorithm_returns_none(self):
        token = security.create_access_token(data={"sub": "1"})
        with patch.object(security.settings, "ALGORITHM", "HS512"):
            assert security.decode_access_token(token) is None

    def test_round_trip_preserves_all_data_same(self):
        data = {"sub": "99", "email": "round.trip@viducate.com"}
        token = security.create_access_token(data=data)
        payload = security.decode_access_token(token)
        assert payload["sub"] == data["sub"]
        assert payload["email"] == data["email"]