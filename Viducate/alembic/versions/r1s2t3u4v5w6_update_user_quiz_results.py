"""update user_quiz_results table

Revision ID: r1s2t3u4v5w6
Revises: 9c1b69c0992e
Create Date: 2026-06-09 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'r1s2t3u4v5w6'
down_revision: Union[str, Sequence[str], None] = '9c1b69c0992e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the old table and recreate cleanly
    op.drop_table('user_quiz_results')

    op.create_table(
        'user_quiz_results',
        sa.Column('id',            sa.Integer(),   nullable=False, autoincrement=True),
        sa.Column('quiz_id',       sa.Integer(),   nullable=False),
        sa.Column('user_id',       sa.Integer(),   nullable=False),
        sa.Column('correct_count', sa.Integer(),   nullable=False),
        sa.Column('wrong_count',   sa.Integer(),   nullable=False),
        sa.Column('score',         sa.Integer(),   nullable=False),
        sa.Column('trials',        sa.Integer(),   nullable=False, server_default='1'),
        sa.Column('answers',       sa.JSON(),      nullable=True),
        sa.Column('submitted_at',  sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['quiz_id'], ['quiz.quiz_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'],      ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('quiz_id', 'user_id', name='uq_quiz_user')
    )
    op.create_index('ix_user_quiz_results_quiz_id', 'user_quiz_results', ['quiz_id'])
    op.create_index('ix_user_quiz_results_user_id', 'user_quiz_results', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_user_quiz_results_user_id', table_name='user_quiz_results')
    op.drop_index('ix_user_quiz_results_quiz_id', table_name='user_quiz_results')
    op.drop_table('user_quiz_results')

    op.create_table(
        'user_quiz_results',
        sa.Column('id',            sa.Integer(),   nullable=False, autoincrement=True),
        sa.Column('quiz_id',       sa.Integer(),   nullable=False),
        sa.Column('user_id',       sa.Integer(),   nullable=False),
        sa.Column('correct_count', sa.Integer(),   nullable=False),
        sa.Column('wrong_count',   sa.Integer(),   nullable=False),
        sa.Column('answers',       sa.JSON(),      nullable=True),
        sa.Column('submitted_at',  sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['quiz_id'], ['quiz.quiz_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'],      ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )