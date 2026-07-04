import logging
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.video import Video
from app.models.topic_segment import TopicSegment
from app.models.content_preferences import ContentPreferences
from app.models.quiz import Quiz, QuizQuestion
from app.repositories.quiz_repository import QuizRepository
from app.repositories.video_repository import VideoRepository
from app.ml.engines.quiz_engine import generate_segment_quiz, generate_video_quiz
from app.services.network_errors import NetworkUnavailableError

from app.services.quality_service import (
    score_feature_vs_segmentation,
    extract_text_from_quiz,
)
from app.services.quality_retry import run_with_quality_retry

logger = logging.getLogger(__name__)


def _format_seconds(seconds: int) -> str:
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"




def _build_question_response_secure(q: QuizQuestion) -> dict:
    return {
        "question_id":     q.question_id,
        "question_text":   q.question_text,
        "choices": {
            "a": q.choice_a,
            "b": q.choice_b,
            "c": q.choice_c,
            "d": q.choice_d,
        },
        "video_timestamp": q.video_timestamp,
        "timestamp_label": q.timestamp_label,
        "segment_id":      q.segment_id,
        "concept":         q.concept,
    }


class QuizService:
    def __init__(self, db: Session):
        self.db = db
        self.quiz_repo = QuizRepository(db)
        self.video_repo = VideoRepository(db)

  

    def _get_video_or_404(self, video_id: int) -> Video:
        video = self.video_repo.get_by_id(video_id)
        if not video:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
        return video

    def _check_ownership(self, video: Video, user_id: int):
        if video.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    def _check_processing_complete(self, video: Video):
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Video is not ready yet. Status: {video.processing_status}",
            )

    def _resolve_language(self, user_id: int, video_id: int, video_language: str) -> str:
       
        pref = (
            self.db.query(ContentPreferences)
            .filter(
                ContentPreferences.user_id == user_id,
                ContentPreferences.video_id == video_id,
            )
            .first()
        )
        if pref and pref.quiz_language:
            logger.info(f"[QuizService] Language from preference: {pref.quiz_language}")
            return pref.quiz_language
        resolved = video_language or "en"
        logger.info(f"[QuizService] Language fallback to video: {resolved}")
        return resolved

    def _get_segment_or_404(self, segment_id: int, video_id: int) -> TopicSegment:
        seg = (
            self.db.query(TopicSegment)
            .options(joinedload(TopicSegment.subtopics))
            .filter(
                TopicSegment.segment_id == segment_id,
                TopicSegment.vid_id == video_id,
            )
            .first()
        )
        if not seg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Segment {segment_id} not found for video {video_id}",
            )
        return seg

    def _build_quiz_response(self, quiz: Quiz, questions: list) -> dict:
        return {
            "quiz_id":         quiz.quiz_id,
            "video_id":        quiz.video_id,
            "segment_id":      quiz.segment_id,
            "quiz_type":       quiz.quiz_type,
            "difficulty":      quiz.difficulty,
            "language":        quiz.language,
            "total_questions": len(questions),
            "questions":       [_build_question_response_secure(q) for q in questions],
            "created_at":      quiz.created_at,
        }

    def generate_segment_quiz(
        self,
        video_id: int,
        segment_id: int,
        user_id: int,
        difficulty: str,
    ) -> dict:
        
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        segment = self._get_segment_or_404(segment_id, video_id)
        language = self._resolve_language(user_id, video_id, video.language or "en")

        subtopics_data = [
            {"name": st.name, "description": st.description or ""}
            for st in segment.subtopics
            if st.name
        ]

        logger.info(
            f"[QuizService] Generating segment quiz | "
            f"video_id={video_id} segment_id={segment_id} "
            f"difficulty={difficulty} lang={language}"
        )



        try:
            raw_questions, quality = run_with_quality_retry(
            generator_fn=lambda seg=segment, subs=subtopics_data: generate_segment_quiz(
            segment_title=seg.title,
            main_topic=seg.main_topic or seg.title,
            subtopics=subs,
            difficulty=difficulty,
            language=language,
            segment_start_time=seg.start_time,
            segment_end_time=seg.end_time,     
        ),
            score_fn=lambda result, seg=segment: score_feature_vs_segmentation(
                feature_text=extract_text_from_quiz(result),
                segment=seg,
                content_type="quiz",
            ),
            label=f"quiz segment_id={segment_id}",
            )
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating quiz. Please try again.",
            )
        if not raw_questions:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Failed to generate quiz questions. Please try again.",
            )
    
 
        logger.info(
            f"[QuizService] VALIDATION COMPLETE | segment_id={segment_id} | "
            f"final_score={quality.get('score', 0.0):.4f} | "
            f"flag={quality.get('flag')} | "
            f"retries_used={quality.get('retries', 0)}"
        )
        if quality.get("flag"):
            logger.warning(
                f"[QuizService]  Segment quiz quality BELOW threshold "
                f"(score={quality['score']:.4f} < {quality['threshold']}) "
                f"after {quality.get('retries', 0) + 1} attempts — saving best result"
            )
        else:
            logger.info(
                f"[QuizService]  Segment quiz quality PASSED "
                f"(score={quality['score']:.4f}) in {quality.get('retries', 0) + 1} attempt(s)"
            )
 



        quiz = self.quiz_repo.create_quiz({
            "video_id":   video_id,
            "segment_id": segment_id,
            "difficulty": difficulty,
            "language":   language,
            "quiz_type":  "segment",
        })

    
        question_rows = []
        for q in raw_questions:
            ts = q.get("video_timestamp") or segment.start_time
            question_rows.append({
                "quiz_id":             quiz.quiz_id,
                "segment_id":          segment_id,
                "question_text":       q["question_text"],
                "choice_a":            q["choice_a"],
                "choice_b":            q["choice_b"],
                "choice_c":            q["choice_c"],
                "choice_d":            q["choice_d"],
                "correct_answer":      q["correct_answer"],
                "correct_answer_text": q["correct_answer_text"],
                "explanation":         q.get("explanation"),
                "video_timestamp":     ts,
                "timestamp_label":     _format_seconds(int(ts)),
                "concept":             q.get("concept"),
            })

        self.quiz_repo.bulk_create_questions(question_rows)
        self.db.commit()

    
        questions = self.quiz_repo.get_questions_by_quiz(quiz.quiz_id)
        logger.info(
            f"[QuizService] Segment quiz saved | quiz_id={quiz.quiz_id} | "
            f"questions={len(questions)}"
        )
        return self._build_quiz_response(quiz, questions)

    def generate_video_quiz(
        self,
        video_id: int,
        user_id: int,
        difficulty: str,
    ) -> dict:
       
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_processing_complete(video)

        language = self._resolve_language(user_id, video_id, video.language or "en")

        segments = (
            self.db.query(TopicSegment)
            .options(joinedload(TopicSegment.subtopics))
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

        if not segments:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No segments found for this video. Run processing first.",
            )

       
        segments_data = []
        segment_map = {}   
        for seg in segments:
            segments_data.append({
                "segment_number": seg.segment_number,
                "title":          seg.title,
                "main_topic":     seg.main_topic or seg.title,
                "start_time":     seg.start_time,
                "end_time":       seg.end_time,
                "subtopics":      [
                    {"name": st.name, "description": st.description or ""}
                    for st in seg.subtopics
                    if st.name
                ],
            })
            segment_map[seg.segment_number] = seg

        logger.info(
            f"[QuizService] Generating video quiz | video_id={video_id} | "
            f"segments={len(segments)} | difficulty={difficulty} | lang={language}"
        )


        reference_segment = segments[0]

        try:
            raw_questions, quality = run_with_quality_retry(
                generator_fn=lambda: generate_video_quiz(
                    video_title=video.title,
                    segments=segments_data,
                    difficulty=difficulty,
                    language=language,
                ),
                score_fn=lambda result, seg=reference_segment: score_feature_vs_segmentation(
                    feature_text=extract_text_from_quiz(result),
                    segment=seg,
                    content_type="quiz",
                ),
                label=f"video_quiz video_id={video_id}",
            )
        except NetworkUnavailableError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network connection issue while generating quiz. Please try again.",
            )

        if not raw_questions:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Failed to generate video quiz. Please try again.",
            )

        logger.info(
            f"[QuizService] VALIDATION COMPLETE | video_quiz video_id={video_id} | "
            f"final_score={quality.get('score', 0.0):.4f} | "
            f"flag={quality.get('flag')} | "
            f"retries_used={quality.get('retries', 0)}"
        )
        if quality.get("flag"):
            logger.warning(
                f"[QuizService]  Video quiz quality BELOW threshold "
                f"(score={quality['score']:.4f} < {quality['threshold']}) "
                f"after {quality.get('retries', 0) + 1} attempts — saving best result"
            )
        else:
            logger.info(
                f"[QuizService]  Video quiz quality PASSED "
                f"(score={quality['score']:.4f}) in {quality.get('retries', 0) + 1} attempt(s)"
            )


        
        quiz = self.quiz_repo.create_quiz({
            "video_id":   video_id,
            "segment_id": None,
            "difficulty": difficulty,
            "language":   language,
            "quiz_type":  "video",
        })

        
        question_rows = []
        for q in raw_questions:
            seg_num = q.get("segment_number")
            seg_obj = segment_map.get(seg_num)
            seg_id  = seg_obj.segment_id if seg_obj else None
            ts      = q.get("video_timestamp") or (seg_obj.start_time if seg_obj else 0)

            question_rows.append({
                "quiz_id":             quiz.quiz_id,
                "segment_id":          seg_id,
                "question_text":       q["question_text"],
                "choice_a":            q["choice_a"],
                "choice_b":            q["choice_b"],
                "choice_c":            q["choice_c"],
                "choice_d":            q["choice_d"],
                "correct_answer":      q["correct_answer"],
                "correct_answer_text": q["correct_answer_text"],
                "explanation":         q.get("explanation"),
                "video_timestamp":     int(ts),
                "timestamp_label":     _format_seconds(int(ts)),
                "concept":             q.get("concept"),
            })

        self.quiz_repo.bulk_create_questions(question_rows)
        self.db.commit()

        questions = self.quiz_repo.get_questions_by_quiz(quiz.quiz_id)
        logger.info(
            f"[QuizService] Video quiz saved | quiz_id={quiz.quiz_id} | "
            f"questions={len(questions)}"
        )
        return self._build_quiz_response(quiz, questions)