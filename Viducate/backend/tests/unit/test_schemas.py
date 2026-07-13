"""
Unit tests for Pydantic schema validators.

Covers app/schemas/user.py, app/schemas/video.py, app/schemas/segment_schema.py,
app/schemas/segment_full_schema.py, and app/schemas/profile_schema.py.
"""

import pytest
from pydantic import ValidationError

from app.schemas.user import (
    UserRegisterRequest,
    ResetPasswordRequest,
)
from app.schemas.video import (
    VideoUploadURLRequest,
    PresignedUploadRequest,
    SaveVideoRequest,
)
from app.schemas.segment_schema import SegmentSchema
from app.schemas.segment_full_schema import SegmentFullSchema
from app.schemas.profile_schema import UpdateProfileRequest


# UserRegisterRequest
class TestUserRegisterRequest:
    VALID = dict(
        first_name="Ahmed",
        last_name="Mohamed",
        email="ahmed@viducate.com",
        password="StrongPass1!",
        study_field="Computer Science",
        language_preference="en",
    )

    def test_valid_payload_parses_successfully(self):
        req = UserRegisterRequest(**self.VALID)
        assert req.email == "ahmed@viducate.com"
        assert req.password == "StrongPass1!"

    def test_invalid_email_raises(self):
        with pytest.raises(ValidationError):
            UserRegisterRequest(**{**self.VALID, "email": "not-an-email"})

    @pytest.mark.parametrize("bad_password", [
        "short1A",    # <8 chars
        "alllowercase1",
        "ALLUPPERCASE",
        "NoDigitsHere",
    ])
    def test_weak_password_raises(self, bad_password):
        with pytest.raises(ValidationError):
            UserRegisterRequest(**{**self.VALID, "password": bad_password})

    def test_password_exactly_eight_chars_with_upper_and_digit_is_valid(self):
        req = UserRegisterRequest(**{**self.VALID, "password": "Abcdefg1!"})
        assert req.password == "Abcdefg1!"

    def test_name_shorter_than_two_chars_raises(self):
        with pytest.raises(ValidationError):
            UserRegisterRequest(**{**self.VALID, "first_name": "A"})

    def test_name_is_stripped_of_whitespace(self):
        req = UserRegisterRequest(**{**self.VALID, "first_name": "  Ahmed  "})
        assert req.first_name == "Ahmed"

    def test_none_name_is_allowed_since_optional(self):
        req = UserRegisterRequest(**{**self.VALID, "first_name": None})
        assert req.first_name is None

    def test_arabic_name_is_accepted(self):
        req = UserRegisterRequest(**{**self.VALID, "first_name": "أحمد", "last_name": "محمد"})
        assert req.first_name == "أحمد"

    def test_empty_name_raises(self):
        with pytest.raises(ValidationError):
            UserRegisterRequest(**{**self.VALID, "first_name": ""})

    @pytest.mark.parametrize("lang", ["ar", "en"])
    def test_valid_language_preference_accepted(self, lang):
        req = UserRegisterRequest(**{**self.VALID, "language_preference": lang})
        assert req.language_preference == lang

    def test_invalid_language_preference_raises(self):
        with pytest.raises(ValidationError):
            UserRegisterRequest(**{**self.VALID, "language_preference": "fr"})

    def test_missing_required_email_raises(self):
        payload = {k: v for k, v in self.VALID.items() if k != "email"}
        with pytest.raises(ValidationError):
            UserRegisterRequest(**payload)


# ResetPasswordRequest
class TestResetPasswordRequest:
    def test_matching_passwords_parse_successfully(self):
        req = ResetPasswordRequest(
            token="sometoken",
            new_password="NewPass123!",
            confirm_password="NewPass123!",
        )
        assert req.new_password == "NewPass123!"

    def test_mismatched_passwords_raise(self):
        with pytest.raises(ValidationError):
            ResetPasswordRequest(
                token="sometoken",
                new_password="NewPass123",
                confirm_password="DifferentPass1",
            )

    def test_weak_new_password_raises(self):
        with pytest.raises(ValidationError):
            ResetPasswordRequest(
                token="sometoken",
                new_password="weak",
                confirm_password="weak",
            )


# VideoUploadURLRequest
class TestVideoUploadURLRequest:
    def test_valid_https_url_parses(self):
        req = VideoUploadURLRequest(url="https://youtube.com/watch?v=abc123", title="My Video")
        assert req.language == "en"

    def test_valid_http_url_parses(self):
        req = VideoUploadURLRequest(url="http://example.com/video.mp4", title="My Video")
        assert req.url.startswith("http://")

    def test_url_without_scheme_raises(self):
        with pytest.raises(ValidationError):
            VideoUploadURLRequest(url="youtube.com/watch?v=abc123", title="My Video")

    def test_ftp_scheme_raises(self):
        with pytest.raises(ValidationError):
            VideoUploadURLRequest(url="ftp://example.com/video.mp4", title="My Video")

    def test_title_shorter_than_two_chars_raises(self):
        with pytest.raises(ValidationError):
            VideoUploadURLRequest(url="https://example.com/v.mp4", title="A")

    def test_title_is_stripped(self):
        req = VideoUploadURLRequest(url="https://example.com/v.mp4", title="  Lecture 1  ")
        assert req.title == "Lecture 1"

    def test_default_language_is_english(self):
        req = VideoUploadURLRequest(url="https://example.com/v.mp4", title="Lecture")
        assert req.language == "en"

    def test_explicit_arabic_language_accepted(self):
        req = VideoUploadURLRequest(url="https://example.com/v.mp4", title="Lecture", language="ar")
        assert req.language == "ar"

    def test_invalid_language_raises(self):
        with pytest.raises(ValidationError):
            VideoUploadURLRequest(url="https://example.com/v.mp4", title="Lecture", language="fr")


# PresignedUploadRequest
class TestPresignedUploadRequest:
    VALID = dict(filename="lecture.mp4", title="Lecture 1", file_size=1024 * 1024)

    def test_valid_payload_parses(self):
        req = PresignedUploadRequest(**self.VALID)
        assert req.filename == "lecture.mp4"

    @pytest.mark.parametrize("filename", [
        "lecture.mp4", "lecture.mov", "lecture.avi", "lecture.mkv",
        "lecture.webm", "lecture.flv",
    ])
    def test_allowed_extensions_accepted(self, filename):
        req = PresignedUploadRequest(**{**self.VALID, "filename": filename})
        assert req.filename == filename

    @pytest.mark.parametrize("filename", [
        "lecture.txt", "lecture.pdf", "lecture.exe", "lecture",
    ])
    def test_disallowed_extensions_raise(self, filename):
        with pytest.raises(ValidationError):
            PresignedUploadRequest(**{**self.VALID, "filename": filename})

    def test_zero_file_size_raises(self):
        with pytest.raises(ValidationError):
            PresignedUploadRequest(**{**self.VALID, "file_size": 0})

    def test_negative_file_size_raises(self):
        with pytest.raises(ValidationError):
            PresignedUploadRequest(**{**self.VALID, "file_size": -100})

    def test_file_size_at_exactly_one_gb_is_allowed(self):
        one_gb = 1 * 1024 * 1024 * 1024
        req = PresignedUploadRequest(**{**self.VALID, "file_size": one_gb})
        assert req.file_size == one_gb

    def test_file_size_over_one_gb_raises(self):
        over_gb = 1 * 1024 * 1024 * 1024 + 1
        with pytest.raises(ValidationError):
            PresignedUploadRequest(**{**self.VALID, "file_size": over_gb})


# SaveVideoRequest
class TestSaveVideoRequest:
    def test_defaults_apply_when_optional_fields_omitted(self):
        req = SaveVideoRequest(video_id=1)
        assert req.completed_segment_ids == []
        assert req.bookmarks == []
        assert req.current_time == 0
        assert req.duration == 0

    def test_negative_current_time_raises(self):
        with pytest.raises(ValidationError):
            SaveVideoRequest(video_id=1, current_time=-5)

    def test_zero_current_time_is_valid(self):
        req = SaveVideoRequest(video_id=1, current_time=0)
        assert req.current_time == 0


# SegmentSchema
class TestSegmentSchema:
    VALID = dict(
        video_id=1, segment_number=1, start_time=0, end_time=60,
        main_topic="Intro to recursion", title="Recursion basics",
    )

    def test_valid_payload_parses(self):
        seg = SegmentSchema(**self.VALID)
        assert seg.segment_number == 1

    def test_segment_number_zero_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "segment_number": 0})

    def test_negative_segment_number_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "segment_number": -1})

    def test_title_shorter_than_three_chars_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "title": "Hi"})

    def test_main_topic_shorter_than_three_chars_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "main_topic": "Hi"})

    def test_negative_start_time_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "start_time": -1})

    def test_end_time_equal_to_start_time_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "start_time": 30, "end_time": 30})

    def test_end_time_before_start_time_raises(self):
        with pytest.raises(ValidationError):
            SegmentSchema(**{**self.VALID, "start_time": 60, "end_time": 30})

    def test_end_time_after_start_time_is_valid(self):
        seg = SegmentSchema(**{**self.VALID, "start_time": 0, "end_time": 1})
        assert seg.end_time > seg.start_time

    def test_title_and_topic_are_stripped(self):
        seg = SegmentSchema(**{**self.VALID, "title": "  Padded title  "})
        assert seg.title == "Padded title"


# SegmentFullSchema
class TestSegmentFullSchema:
    def test_valid_payload_with_subtopics_parses(self):
        seg = SegmentFullSchema(
            video_id=1, segment_number=1, start_time=0, end_time=60,
            main_topic="Loops", title="For and while loops",
            sub_topics=[{"name": "for loop", "description": "iterates a fixed number of times",
                         "start_time": 0, "end_time": 30}],
        )
        assert len(seg.sub_topics) == 1
        assert seg.key_points == [] 

    def test_missing_sub_topics_raises_since_required(self):
        with pytest.raises(ValidationError):
            SegmentFullSchema(
                video_id=1, segment_number=1, start_time=0, end_time=60,
                main_topic="Loops", title="For and while loops",
            )

    def test_empty_sub_topics_list_is_valid(self):
        seg = SegmentFullSchema(
            video_id=1, segment_number=1, start_time=0, end_time=60,
            main_topic="Loops", title="For and while loops", sub_topics=[],
        )
        assert seg.sub_topics == []

    def test_key_points_optional_with_default(self):
        seg = SegmentFullSchema(
            video_id=1, segment_number=1, start_time=0, end_time=60,
            main_topic="Loops", title="For and while loops", sub_topics=[],
        )
        assert seg.key_points == []


# UpdateProfileRequest
class TestUpdateProfileRequest:
    def test_name_only_update_does_not_require_password(self):
        req = UpdateProfileRequest(first_name="NewName")
        assert req.first_name == "NewName"
        assert req.new_password is None

    def test_password_change_without_current_password_raises(self):
        with pytest.raises(ValidationError):
            UpdateProfileRequest(
                new_password="NewPass123",
                confirm_password="NewPass123",
            )

    def test_valid_password_change_parses(self):
        req = UpdateProfileRequest(
            current_password="OldPass123",
            new_password="NewPass123",
            confirm_password="NewPass123",
        )
        assert req.new_password == "NewPass123"

    def test_weak_new_password_raises(self):
        with pytest.raises(ValidationError):
            UpdateProfileRequest(
                current_password="OldPass123",
                new_password="weak",
                confirm_password="weak",
            )

    def test_name_too_short_raises(self):
        with pytest.raises(ValidationError):
            UpdateProfileRequest(first_name="A")