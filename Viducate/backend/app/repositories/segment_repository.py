from sqlalchemy.orm import Session
from app.models.topic_segment import TopicSegment
from app.models.subtopics import Subtopic
from app.models.keypoints import Keypoint

from typing import Optional, List

def time_to_seconds(t):
    if isinstance(t, int):
        return t

    parts = list(map(int, t.split(":")))

    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0

class SegmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_segment(self, video_id: int, segment_data: dict) -> TopicSegment:

        segment = TopicSegment(
            vid_id=video_id,
            segment_number=segment_data["segment_number"],
            start_time=time_to_seconds(segment_data["start_time"]),
            end_time=time_to_seconds(segment_data["end_time"]),
            main_topic=segment_data["main_topic"],
            title=segment_data["title"]
        )
        self.db.add(segment)
        self.db.flush()

        return segment

    def create_subtopics(self, segment_id: int, subtopics: list):

        db_objects = []

        for sub in subtopics:
            obj = Subtopic(
                segment_id=segment_id,
                name=sub["name"],
                description=sub["description"],
                start_time=time_to_seconds(sub["start_time"]),
                end_time=time_to_seconds(sub["end_time"]),
            )
            db_objects.append(obj)

        self.db.add_all(db_objects)
        return db_objects
    
    def create_keypoints(self, segment_id: int, keypoints: list):

        db_objects = []

        for point in keypoints or []:
            obj = Keypoint(
                segment_id=segment_id,
                description=point
            )
            db_objects.append(obj)

        self.db.add_all(db_objects)
        return db_objects
    
    def create_full_segment(self, video_id: int, segment_data: dict) -> TopicSegment:

        try:
            print(" inserting:", segment_data)

            # 1. segment
            segment = self.create_segment(video_id, segment_data)

            print(" segment created ID:", segment.segment_id)

            # 2. subtopics
            subtopics = segment_data.get("sub_topics", [])
            self.create_subtopics(segment.segment_id, subtopics)
            print(" subtopics added")

            # 3. keypoints
            keypoints = segment_data.get("key_points", [])
            self.create_keypoints(segment.segment_id, keypoints)
            print(" keypoints added")


            # 4. commit once
            self.db.commit()
            self.db.refresh(segment)

            return segment

        except Exception as e:
            self.db.rollback()
            print(" ERROR in create_full_segment:", e)
            raise e
        

 
    def get_by_video(self, video_id: int) -> List[TopicSegment]:
        return (
            self.db.query(TopicSegment)
            .filter(TopicSegment.vid_id == video_id)
            .order_by(TopicSegment.segment_number)
            .all()
        )

    def update_quality(
        self,
        segment_id: int,
        quality_score: float,
        quality_flag: bool,
        retry_count: int = 0,
    ) -> None:

        segment = self.db.query(TopicSegment).filter(
            TopicSegment.segment_id == segment_id
        ).first()
        if segment:
            segment.quality_score = quality_score
            segment.quality_flag  = quality_flag
            segment.retry_count   = retry_count
            self.db.commit()

    def get_flagged_segments(self, video_id: int) -> list:
        return (
            self.db.query(TopicSegment)
            .filter(
                TopicSegment.vid_id       == video_id,
                TopicSegment.quality_flag == True,
            )
            .order_by(TopicSegment.segment_number)
            .all()
        )