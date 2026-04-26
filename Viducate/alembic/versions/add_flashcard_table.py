"""add flashcard table

Revision ID: a1b2c3d4e5f6
Revises: 8572bda6f6b5
Create Date: 2026-04-23 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '8572bda6f6b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'flashcard',
        sa.Column('flashcard_id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('segment_id',   sa.Integer(), nullable=False),
        sa.Column('video_id',     sa.Integer(), nullable=False),
        sa.Column('question',     sa.Text(),    nullable=False),
        sa.Column('answer',       sa.Text(),    nullable=False),
        sa.Column('language',     sa.String(length=10), nullable=True),
        sa.Column('difficulty',   sa.String(length=20), nullable=True),
        sa.Column('created_at',   sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['segment_id'], ['topic_segment.segment_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['video_id'],   ['video.vid'],                ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('flashcard_id'),
    )
    op.create_index('ix_flashcard_segment_id', 'flashcard', ['segment_id'])
    op.create_index('ix_flashcard_video_id',   'flashcard', ['video_id'])


def downgrade() -> None:
    op.drop_index('ix_flashcard_video_id',   table_name='flashcard')
    op.drop_index('ix_flashcard_segment_id', table_name='flashcard')
    op.drop_table('flashcard')