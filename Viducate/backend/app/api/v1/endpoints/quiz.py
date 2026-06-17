"""
quiz.py  –  FastAPI router
───────────────────────────
POST /api/v1/quiz/video/{video_id}/segment/{segment_id}   → segment quiz
POST /api/v1/quiz/video/{video_id}                        → whole-video quiz
GET  /api/v1/quiz/{quiz_id}                               → fetch existing quiz by ID
"""

import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.quiz_service import QuizService
from app.repositories.quiz_repository import QuizRepository
from app.schemas.quiz_schema import QuizGenerateRequest, QuizResponse
from fastapi import HTTPException
from app.models.quiz import UserQuizResult
from app.schemas.quiz_result_schema import (
    QuizSubmitRequest,
    QuizSubmitResponse,
)

from app.models.quiz import UserQuizResult

router = APIRouter(prefix="/quiz", tags=["Quiz"])
security = HTTPBearer()
logger = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    return AuthService(db).get_current_user(credentials.credentials)



@router.post(
    "/video/{video_id}/segment/{segment_id}",
    response_model=QuizResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate MCQ quiz for a single segment",
    description=(
        "Generates a fresh MCQ quiz for a specific topic segment. "
        "Send difficulty in the request body: easy | medium | hard. "
        "No caching — every call produces new questions."
    ),
)
def generate_segment_quiz(
    video_id:   int,
    segment_id: int,
    request:    QuizGenerateRequest,
    db:         Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = QuizService(db)
    result = service.generate_segment_quiz(
        video_id=video_id,
        segment_id=segment_id,
        user_id=current_user.id,
        difficulty=request.difficulty,
    )
    logger.info(
        f"Segment quiz generated | quiz_id={result['quiz_id']} | "
        f"video={video_id} | segment={segment_id} | user={current_user.id}"
    )
    return result


@router.post(
    "/video/{video_id}",
    response_model=QuizResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate MCQ quiz covering all segments of a video",
    description=(
        "Generates a fresh comprehensive MCQ quiz that covers every topic segment. "
        "Send difficulty in the request body: easy | medium | hard. "
        "No caching — every call produces new questions."
    ),
)
def generate_video_quiz(
    video_id: int,
    request:  QuizGenerateRequest,
    db:       Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = QuizService(db)
    result = service.generate_video_quiz(
        video_id=video_id,
        user_id=current_user.id,
        difficulty=request.difficulty,
    )
    logger.info(
        f"Video quiz generated | quiz_id={result['quiz_id']} | "
        f"video={video_id} | user={current_user.id}"
    )
    return result



@router.get(
    "/{quiz_id}",
    response_model=QuizResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch a previously generated quiz by its ID",
    description="Use this to retrieve a quiz that was generated in a previous call.",
)
def get_quiz(
    quiz_id: int,
    db:      Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from fastapi import HTTPException
    repo = QuizRepository(db)
    quiz = repo.get_quiz_with_questions(quiz_id)
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    # Quick ownership check via video
    from app.repositories.video_repository import VideoRepository
    video = VideoRepository(db).get_by_id(quiz.video_id)
    if not video or video.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    from app.services.quiz_service import _build_question_response
    return {
        "quiz_id":         quiz.quiz_id,
        "video_id":        quiz.video_id,
        "segment_id":      quiz.segment_id,
        "quiz_type":       quiz.quiz_type,
        "difficulty":      quiz.difficulty,
        "language":        quiz.language,
        "total_questions": len(quiz.questions),
        "questions":       [_build_question_response(q) for q in quiz.questions],
        "created_at":      quiz.created_at,
    }


@router.post(
    "/{quiz_id}/submit",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit quiz answers and save result",
    description=(
        "Submits answers, calculates integer score (0-100), "
        "and saves/overwrites the result. Tracks number of trials."
    ),
)
def submit_quiz_results(
    quiz_id: int,
    request: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = QuizRepository(db)

    # ── Fetch quiz ────────────────────────────────────────────────────────────
    quiz = repo.get_quiz_with_questions(quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

   
    from app.repositories.video_repository import VideoRepository
    video = VideoRepository(db).get_by_id(quiz.video_id)
    if not video or video.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    # ── Calculate score ───────────────────────────────────────────────────────
    total         = len(request.answers)
    correct_count = sum(1 for a in request.answers if a.is_correct)
    wrong_count   = total - correct_count
    score         = int(round((correct_count / total) * 100)) if total > 0 else 0

    answers_payload = [
        {
            "question_id": a.question_id,
            "user_answer": a.user_answer,
            "is_correct":  a.is_correct,
        }
        for a in request.answers
    ]

    # ── Upsert result (overwrite if exists, increment trials) ─────────────────
    existing = (
    db.query(UserQuizResult)
        .filter(
            UserQuizResult.quiz_id == quiz_id,
            UserQuizResult.user_id == current_user.id
        )
        .first()
    )

    if existing:
        existing.correct_count = correct_count
        existing.wrong_count   = wrong_count
        existing.score         = score
        existing.trials        = existing.trials + 1
        existing.answers       = answers_payload
        db.commit()
        db.refresh(existing)

        trials = existing.trials
        is_new = False
        logger.info(
            f"Quiz result overwritten | quiz_id={quiz_id} | "
            f"user={current_user.id} | trial={trials} | score={score}"
        )
    else:
        new_result = UserQuizResult(
            quiz_id=quiz_id,
            user_id=current_user.id,
            correct_count=correct_count,
            wrong_count=wrong_count,
            score=score,
            trials=1,
            answers=answers_payload,
        )
        db.add(new_result)
        db.commit()
        db.refresh(new_result)

        trials = 1
        is_new = True
        logger.info(
            f"Quiz result saved | quiz_id={quiz_id} | "
            f"user={current_user.id} | score={score}"
        )

    return {
        "quiz_id":       quiz_id,
        "correct_count": correct_count,
        "wrong_count":   wrong_count,
        "total":         total,
        "score":         score,
        "trials":        trials,
        "is_new":        is_new,
    }