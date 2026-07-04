import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.quiz import QuizQuestion
from app.models.subtopics import Subtopic


from app.repositories.report_repository import ReportRepository

logger = logging.getLogger(__name__)

MASTERY_MASTERED = 90   # score >= 90  mastered
MASTERY_STRONG   = 70   # score >= 70  strong
MASTERY_WEAK     = 0    # score >  0   weak 
# score == 0 with attempts   weak
# no attempts at all         needs_quiz


def _mastery_level(score: int, attempts: int) -> str:
    if attempts == 0:
        return "needs_quiz"
    if score >= MASTERY_MASTERED:
        return "mastered"
    if score >= MASTERY_STRONG:
        return "strong"
    return "weak"


def _extract_weak_areas(
    answers_payload,
    quiz_questions
):
    if not answers_payload:
        return []

    wrong_ids = {
        a["question_id"]
        for a in answers_payload
        if not a.get("is_correct", True)
    }

    weak_areas = set()

    for q in quiz_questions:
        if q.question_id in wrong_ids and q.concept:
            weak_areas.add(q.concept)

    return list(weak_areas)


class ReportService:
    def __init__(self, db: Session):
        self.db  = db
        self.repo = ReportRepository(db)

    def _get_video_or_404(self, video_id: int):
        video = self.repo.get_video(video_id)
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found",
            )
        return video

    def _check_ownership(self, video, user_id: int):
        if video.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized",
            )

    def _check_completed(self, video):
        if video.processing_status != "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Video is not ready yet. "
                    f"Status: {video.processing_status}"
                ),
            )


    def get_report(self, video_id: int, user_id: int) -> dict:
        video = self._get_video_or_404(video_id)
        self._check_ownership(video, user_id)
        self._check_completed(video)

        segments     = self.repo.get_segments(video_id)
        seg_results  = self.repo.get_all_segment_quiz_results_for_video(video_id, user_id)
        seg_result_map = {r["segment_id"]: r for r in seg_results}

       
        has_summary     = self.repo.has_video_summary(video_id)
        has_studynotes  = self.repo.has_video_studynotes(video_id)
        total_flashcards = self.repo.flashcard_count_for_video(video_id)

        video_quiz = self.repo.get_latest_video_quiz(video_id)
        video_quiz_result = (
            self.repo.get_quiz_result(video_quiz.quiz_id, user_id)
            if video_quiz
            else None
        )
        has_comprehensive_quiz = video_quiz is not None

        topics        = []
        strong_topics = []
        weak_topics   = []

        total_correct   = 0
        total_questions = 0

        for seg in segments:
            seg_id = seg.segment_id
            result = seg_result_map.get(seg_id)

            latest_quiz = self.repo.get_latest_segment_quiz(video_id, seg_id)
            quiz_total = self.repo.get_question_count(latest_quiz.quiz_id) if latest_quiz else 0
            attempts = result["trials"]   if result else 0
            correct = result["correct_count"] if result else 0
            score = result["score"]     if result else 0

            total_correct   += correct
            total_questions += (result["total"] if result else 0)

            mastery = _mastery_level(score, attempts)

            weak_areas: list[str] = []
            if result and latest_quiz:
                quiz_result_obj = self.repo.get_quiz_result(latest_quiz.quiz_id, user_id)
                if quiz_result_obj and quiz_result_obj.answers:
                    questions = (
                        self.db.query(QuizQuestion)
                        .filter(QuizQuestion.quiz_id == latest_quiz.quiz_id)
                        .all()
                    )
                    weak_areas = _extract_weak_areas(quiz_result_obj.answers, questions)

            
            seg_summary    = self.repo.has_segment_summary(seg_id)
            seg_notes      = self.repo.has_segment_studynotes(seg_id)
            seg_quiz_exist = self.repo.has_any_quiz_for_segment(video_id, seg_id)
            seg_flashcards = self.repo.flashcard_count_for_segment(seg_id)

            topic = {
                "id": f"t{seg.segment_number}",
                "title": seg.title,
                "quiz_score": score,
                "mastery_level": mastery,
                "correct_answers": correct if result else None,
                "quiz_total": quiz_total if quiz_total else None,
                "quiz_attempts": attempts,
                "weak_areas": weak_areas,
                "materials_generated": {
                    "summary":     seg_summary,
                    "study_notes": seg_notes,
                    "quiz":        seg_quiz_exist,
                    "flashcards":  seg_flashcards,
                },
            }
            topics.append(topic)

            if mastery == "mastered":
                strong_topics.append(seg.title)
            elif mastery == "strong":
                strong_topics.append(seg.title)
            elif mastery == "weak":
                weak_topics.append(seg.title)

      
        if video_quiz_result:
            overall_score    = video_quiz_result.score
            overall_correct  = video_quiz_result.correct_count
            overall_total    = video_quiz_result.correct_count + video_quiz_result.wrong_count
        else:
            overall_correct  = total_correct
            overall_total    = total_questions
            overall_score    = (
                round((overall_correct / overall_total) * 100)
                if overall_total > 0
                else 0
            )

        logger.info(
            f"[ReportService] Report built | video_id={video_id} | "
            f"score={overall_score} | topics={len(topics)}"
        )

        return {
            "video_id":                   video.vid,
            "title":                      video.title,
            "updated_at":                 video.created_at,
            "overall_score_in_video":     overall_score,
            "correct_answers":            overall_correct,
            "total_quiz_questions":       overall_total,
            "has_summary":                has_summary,
            "has_study_notes":            has_studynotes,
            "has_comprehensive_quiz":     has_comprehensive_quiz,
            "total_flashcards_generated": total_flashcards,
            "strong_topics":              strong_topics,
            "weak_topics":                weak_topics,
            "topics":                     topics,
        }