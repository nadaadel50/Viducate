from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional

from app.models.topic_segment import TopicSegment
from app.models.video import Video
from app.models.video_summary import VideoSummary
from app.models.segment_summary import SegmentSummary
from app.models.studynotes import VideoStudyNotes, SegmentStudyNotes
from app.models.flashcard import Flashcard
from app.models.quiz import Quiz, QuizQuestion, UserQuizResult


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_video(self, video_id: int) -> Optional[Video]:
        return self.db.query(Video).filter(Video.vid == video_id).first()

    def get_segments(self, video_id: int) -> list[TopicSegment]:
        return (
            self.db.query(TopicSegment)
            .options(
                joinedload(TopicSegment.subtopics),
                joinedload(TopicSegment.keypoints),
            )
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

    def has_video_summary(self, video_id: int) -> bool:
        return (
            self.db.query(VideoSummary.sum_id)
            .filter(VideoSummary.video_id == video_id)
            .first()
        ) is not None

    def has_segment_summary(self, segment_id: int) -> bool:
        return (
            self.db.query(SegmentSummary.summary_id)
            .filter(SegmentSummary.segment_id == segment_id)
            .first()
        ) is not None

    def has_video_studynotes(self, video_id: int) -> bool:
        return (
            self.db.query(VideoStudyNotes.notes_id)
            .filter(VideoStudyNotes.video_id == video_id)
            .first()
        ) is not None

    def has_segment_studynotes(self, segment_id: int) -> bool:
        return (
            self.db.query(SegmentStudyNotes.notes_id)
            .filter(SegmentStudyNotes.segment_id == segment_id)
            .first()
        ) is not None

    def flashcard_count_for_video(self, video_id: int) -> int:
        return (
            self.db.query(func.count(Flashcard.flashcard_id))
            .filter(Flashcard.video_id == video_id)
            .scalar()
            or 0
        )

    def flashcard_count_for_segment(self, segment_id: int) -> int:
        return (
            self.db.query(func.count(Flashcard.flashcard_id))
            .filter(Flashcard.segment_id == segment_id)
            .scalar()
            or 0
        )

    def get_latest_segment_quiz(self, video_id: int, segment_id: int) -> Optional[Quiz]:
        return (
            self.db.query(Quiz)
            .filter(
                Quiz.video_id == video_id,
                Quiz.segment_id == segment_id,
                Quiz.quiz_type == "segment",
            )
            .order_by(Quiz.created_at.desc())
            .first()
        )

    def get_latest_video_quiz(self, video_id: int) -> Optional[Quiz]:
        return (
            self.db.query(Quiz)
            .filter(Quiz.video_id == video_id, Quiz.quiz_type == "video")
            .order_by(Quiz.created_at.desc())
            .first()
        )

    def has_any_quiz_for_segment(self, video_id: int, segment_id: int) -> bool:
        return (
            self.db.query(Quiz.quiz_id)
            .filter(
                Quiz.video_id == video_id,
                Quiz.segment_id == segment_id,
            )
            .first()
        ) is not None

    def get_quiz_result(self, quiz_id: int, user_id: int) -> Optional[UserQuizResult]:
        return (
            self.db.query(UserQuizResult)
            .filter(
                UserQuizResult.quiz_id == quiz_id,
                UserQuizResult.user_id == user_id,
            )
            .first()
        )

    def get_question_count(self, quiz_id: int) -> int:
        return (
            self.db.query(func.count(QuizQuestion.question_id))
            .filter(QuizQuestion.quiz_id == quiz_id)
            .scalar()
            or 0
        )

    def get_all_segment_quiz_results_for_video(
        self, video_id: int, user_id: int
    ) -> list[dict]:
        quizzes = (
            self.db.query(Quiz)
            .filter(
                Quiz.video_id == video_id,
                Quiz.quiz_type == "segment",
            )
            .order_by(Quiz.segment_id, Quiz.created_at.desc())
            .all()
        )

        seen_segments: set[int] = set()
        results = []
        for quiz in quizzes:
            if quiz.segment_id in seen_segments:
                continue
            result = self.get_quiz_result(quiz.quiz_id, user_id)
            if result:
                seen_segments.add(quiz.segment_id)
                results.append(
                    {
                        "segment_id": quiz.segment_id,
                        "quiz_id": quiz.quiz_id,
                        "score": result.score,
                        "correct_count": result.correct_count,
                        "wrong_count": result.wrong_count,
                        "total": result.correct_count + result.wrong_count,
                        "trials": result.trials,
                    }
                )
        return results