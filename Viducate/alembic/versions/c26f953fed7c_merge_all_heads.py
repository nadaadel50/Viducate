"""merge all heads

Revision ID: c26f953fed7c
Revises: 73c67c2abc53, a1b2c3d4e5f6
Create Date: 2026-04-29 02:32:06.375980

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c26f953fed7c'
down_revision: Union[str, Sequence[str], None] = ('73c67c2abc53', 'a1b2c3d4e5f6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
