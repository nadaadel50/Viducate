from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'b3c4d5e6f7a8'
down_revision: Union[str, Sequence[str], None] = 'fa8f140f993b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'quiz',
        sa.Column('quiz_id',    sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('video_id',   sa.Integer(), nullable=False),
        sa.Column('segment_id', sa.Integer(), nullable=True),
        sa.Column('difficulty', sa.String(length=20), nullable=True),
        sa.Column('language',   sa.String(length=10), nullable=True),
        sa.Column('quiz_type',  sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['video_id'],   ['video.vid'],                ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['segment_id'], ['topic_segment.segment_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('quiz_id'),
    )
    op.create_index('ix_quiz_video_id',   'quiz', ['video_id'])
    op.create_index('ix_quiz_segment_id', 'quiz', ['segment_id'])

    op.create_table(
        'quiz_question',
        sa.Column('question_id',         sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('quiz_id',             sa.Integer(), nullable=False),
        sa.Column('segment_id',          sa.Integer(), nullable=True),
        sa.Column('question_text',       sa.Text(), nullable=False),
        sa.Column('choice_a',            sa.Text(), nullable=False),
        sa.Column('choice_b',            sa.Text(), nullable=False),
        sa.Column('choice_c',            sa.Text(), nullable=False),
        sa.Column('choice_d',            sa.Text(), nullable=False),
        sa.Column('correct_answer',      sa.String(length=1), nullable=False),
        sa.Column('correct_answer_text', sa.Text(), nullable=False),
        sa.Column('explanation',         sa.Text(), nullable=True),
        sa.Column('video_timestamp',     sa.Integer(), nullable=True),
        sa.Column('timestamp_label',     sa.String(length=12), nullable=True),
        sa.Column('created_at',          sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['quiz_id'],    ['quiz.quiz_id'],                ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['segment_id'], ['topic_segment.segment_id'],    ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('question_id'),
    )
    op.create_index('ix_quiz_question_quiz_id',    'quiz_question', ['quiz_id'])
    op.create_index('ix_quiz_question_segment_id', 'quiz_question', ['segment_id'])


def downgrade() -> None:
    op.drop_index('ix_quiz_question_segment_id', table_name='quiz_question')
    op.drop_index('ix_quiz_question_quiz_id',    table_name='quiz_question')
    op.drop_table('quiz_question')
    op.drop_index('ix_quiz_segment_id', table_name='quiz')
    op.drop_index('ix_quiz_video_id',   table_name='quiz')
    op.drop_table('quiz')