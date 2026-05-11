"""add mindmap table

Revision ID: d1e2f3a4b5c6
Revises: 183aadce7b6c
Create Date: 2026-05-10 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, Sequence[str], None] = '183aadce7b6c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'mindmap',
        sa.Column('map_id',     sa.Integer(),     nullable=False, autoincrement=True),
        sa.Column('video_id',   sa.Integer(),     nullable=False),
        sa.Column('nodes',      sa.JSON(),         nullable=False),
        sa.Column('edges',      sa.JSON(),         nullable=False),
        sa.Column('language',   sa.String(10),     nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(),   server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(),   server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['video_id'], ['video.vid'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('map_id'),
        sa.UniqueConstraint('video_id'),
    )
    op.create_index('ix_mindmap_video_id', 'mindmap', ['video_id'])


def downgrade() -> None:
    op.drop_index('ix_mindmap_video_id', table_name='mindmap')
    op.drop_table('mindmap')