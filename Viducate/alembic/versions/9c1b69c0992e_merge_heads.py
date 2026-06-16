"""merge heads

Revision ID: 9c1b69c0992e
Revises: b371469422b3, q1r2s3t4u5v6
Create Date: 2026-05-19 02:35:58.791048

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c1b69c0992e'
down_revision: Union[str, Sequence[str], None] = ('b371469422b3', 'q1r2s3t4u5v6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
