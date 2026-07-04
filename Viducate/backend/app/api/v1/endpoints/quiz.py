import logging
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.services.quiz_service import _build_question_response_secure
from app.dependencies import get_db
from app.services.auth_service import AuthService
from app.services.quiz_service import QuizService
from app.repositories.quiz_repository import QuizRepository
from fastapi import HTTPException
from app.models.quiz import UserQuizResult
from app.schemas.quiz_result_schema import (
    QuizSubmitRequest,
    QuizSubmitResponse,
)
from app.repositories.video_repository import VideoRepository
from app.models.quiz import UserQuizResult
from app.schemas.quiz_schema import QuizGenerateRequest, QuizResponse, QuizSecureResponse
from app.repositories.video_repository import VideoRepository
from app.repositories.video_repository import VideoRepository
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
    response_model=QuizSecureResponse,
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
    response_model=QuizSecureResponse,
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
    response_model=QuizSecureResponse,
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

    
    video = VideoRepository(db).get_by_id(quiz.video_id)
    if not video or video.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return {
        "quiz_id":         quiz.quiz_id,
        "video_id":        quiz.video_id,
        "segment_id":      quiz.segment_id,
        "quiz_type":       quiz.quiz_type,
        "difficulty":      quiz.difficulty,
        "language":        quiz.language,
        "total_questions": len(quiz.questions),
        "questions":       [_build_question_response_secure(q) for q in quiz.questions],
        "created_at":      quiz.created_at,
    }


@router.post(
    "/{quiz_id}/submit",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit quiz answers and save result",
    description=(
        "Submits answers (question_id + user_answer only), grades them "
        "server-side against the stored correct_answer, calculates an "
        "integer score (0-100), and saves/overwrites the result. "
        "Returns full question details with correct answers for frontend review."
    ),
)
def submit_quiz_results(
    quiz_id: int,
    request: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = QuizRepository(db)

    # Fetch quiz 
    quiz = repo.get_quiz_with_questions(quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

    video = VideoRepository(db).get_by_id(quiz.video_id)
    if not video or video.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    #  Build lookup maps 
    question_map = {q.question_id: q for q in quiz.questions}

    correct_answer_map = {
        q.question_id: q.correct_answer.strip().lower()
        for q in quiz.questions
    }

    #  Build a map of user's submitted answers 
    user_answer_map = {
        a.question_id: (a.user_answer or "").strip().lower()
        for a in request.answers
    }

    #  Grade server-side 
    correct_count = 0
    answers_payload = []

    for a in request.answers:
        correct_answer = correct_answer_map.get(a.question_id)
        if correct_answer is None:
            continue

        submitted = (a.user_answer or "").strip().lower()
        is_correct = submitted == correct_answer
        if is_correct:
            correct_count += 1

        answers_payload.append({
            "question_id": a.question_id,
            "user_answer": a.user_answer,
            "is_correct":  is_correct,
        })

    total = len(quiz.questions)
    wrong_count = total - correct_count
    score = int(round((correct_count / total) * 100)) if total > 0 else 0

    #  Upsert result 
    existing = (
        db.query(UserQuizResult)
        .filter(
            UserQuizResult.quiz_id == quiz_id,
            UserQuizResult.user_id == current_user.id,
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

    #  Build full question results for response 
    question_results = []
    for q in quiz.questions:
        user_answer = user_answer_map.get(q.question_id)
        graded = next(
            (a for a in answers_payload if a["question_id"] == q.question_id),
            None,
        )
        is_correct = graded["is_correct"] if graded else False

        question_results.append({
            "question_id":         q.question_id,
            "question_text":       q.question_text,
            "choices": {
                "a": q.choice_a,
                "b": q.choice_b,
                "c": q.choice_c,
                "d": q.choice_d,
            },
            "user_answer":         user_answer,
            "correct_answer":      q.correct_answer,
            "correct_answer_text": q.correct_answer_text,
            "is_correct":          is_correct,
            "explanation":         q.explanation,
            "video_timestamp":     q.video_timestamp,
            "timestamp_label":     q.timestamp_label,
            "segment_id":          q.segment_id,
            "concept":             q.concept,
        })

    return {
        "quiz_id":       quiz_id,
        "correct_count": correct_count,
        "wrong_count":   wrong_count,
        "total":         total,
        "score":         score,
        "trials":        trials,
        "is_new":        is_new,
        "questions":     question_results,
    }
