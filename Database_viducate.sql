DROP TABLE IF EXISTS answer_options CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS quiz CASCADE;
DROP TABLE IF EXISTS keypoints CASCADE;
DROP TABLE IF EXISTS subtopics CASCADE;
DROP TABLE IF EXISTS topic_segment CASCADE;
DROP TABLE IF EXISTS slide CASCADE;
DROP TABLE IF EXISTS segment_summary CASCADE;
DROP TABLE IF EXISTS video_summary CASCADE;
DROP TABLE IF EXISTS user_quiz_attempts CASCADE;
DROP TABLE IF EXISTS stuck_event CASCADE;
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS mindmap CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS user_analytics CASCADE;
DROP TABLE IF EXISTS video CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    study_field VARCHAR(100),
    educational_level VARCHAR(50),
    language_preference VARCHAR(10) DEFAULT 'en',
    account_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    total_watch_time INTEGER DEFAULT 0,
    total_videos_watched INTEGER DEFAULT 0,
    total_quizzes_taken INTEGER DEFAULT 0,
    avg_quiz_scores DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE settings (
    sett_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    notification_preferences JSONB DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE video (
    vid SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000),
    duration INTEGER, 
    language VARCHAR(10) DEFAULT 'en',
    section VARCHAR(200),
    processing_status VARCHAR(50) DEFAULT 'uploaded',
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_summary (
    sum_id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES video(vid) ON DELETE CASCADE,
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id)
);

CREATE TABLE slide (
    slide_id SERIAL PRIMARY KEY,
    vid_id INTEGER NOT NULL REFERENCES video(vid) ON DELETE CASCADE,
    slide_num INTEGER NOT NULL,
    text TEXT,
    timestamp INTEGER,
    image_path VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vid_id, slide_num)
);

CREATE TABLE topic_segment (
    segment_id SERIAL PRIMARY KEY,
    vid_id INTEGER NOT NULL REFERENCES video(vid) ON DELETE CASCADE,
    segment_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    maintopic TEXT,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vid_id, segment_number)
);

CREATE TABLE segment_summary (
    summary_id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES topic_segment(segment_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(segment_id)
);

CREATE TABLE subtopics (
    subtopic_id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES topic_segment(segment_id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    time_start INTEGER,
    time_end INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE keypoints (
    keypoint_id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES topic_segment(segment_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz (
    quiz_id SERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL REFERENCES topic_segment(segment_id) ON DELETE CASCADE,
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    type VARCHAR(50) DEFAULT 'mcq',
    mode VARCHAR(20) DEFAULT 'learning', -- 'learning' or 'exam'
    time_limit INTEGER, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question (
    ques_id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    ques_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'mcq',
    difficulty VARCHAR(20) DEFAULT 'medium',
    correct_answer TEXT NOT NULL,
    corrans_explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answer_options (
    option_id SERIAL PRIMARY KEY,
    ques_id INTEGER NOT NULL REFERENCES question(ques_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_quiz_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quiz(quiz_id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER 
);

CREATE TABLE chat_history (
    chat_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    video_id INTEGER NOT NULL REFERENCES video(vid) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stuck_event (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    segment_id INTEGER NOT NULL REFERENCES topic_segment(segment_id) ON DELETE CASCADE,
    pause_duration INTEGER, 
    rewatch_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mindmap (
    map_id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES video(vid) ON DELETE CASCADE,
    structure_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id)
);

