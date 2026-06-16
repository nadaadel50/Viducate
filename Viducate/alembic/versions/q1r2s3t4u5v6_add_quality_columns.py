"""add quality columns to topic_segment

Revision ID: q1r2s3t4u5v6
Revises: 183aadce7b6c
Create Date: 2026-05-17 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'q1r2s3t4u5v6'
down_revision: Union[str, Sequence[str], None] = '183aadce7b6c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('topic_segment',
        sa.Column('quality_score', sa.Float(), nullable=True))
    op.add_column('topic_segment',
        sa.Column('quality_flag',  sa.Boolean(), server_default='false', nullable=False))
    op.add_column('topic_segment',
        sa.Column('retry_count',   sa.Integer(), server_default='0',     nullable=False))


def downgrade() -> None:
    op.drop_column('topic_segment', 'retry_count')
    op.drop_column('topic_segment', 'quality_flag')
    op.drop_column('topic_segment', 'quality_score')