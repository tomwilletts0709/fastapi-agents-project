"""Seed default agent and user

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """INSERT INTO agents (id, name, description)
           VALUES (1, 'Research Assistant', 'Helps with nuanced questions and research')
           ON CONFLICT (id) DO NOTHING"""
    )
    op.execute(
        """INSERT INTO users (id, name, email)
           VALUES (1, 'Default User', 'user@example.com')
           ON CONFLICT (id) DO NOTHING"""
    )


def downgrade() -> None:
    op.execute("DELETE FROM users WHERE id = 1")
    op.execute("DELETE FROM agents WHERE id = 1")
