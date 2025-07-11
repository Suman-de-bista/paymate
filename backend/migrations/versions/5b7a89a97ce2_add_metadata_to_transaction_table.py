"""add metadata to transaction table

Revision ID: 5b7a89a97ce2
Revises: 552e96bc0986
Create Date: 2025-05-09 22:57:27.930656

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b7a89a97ce2'
down_revision: Union[str, None] = '552e96bc0986'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transactions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('group_id', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('amount', sa.Float(), nullable=True),
    sa.Column('paid_by', sa.String(), nullable=True),
    sa.Column('split_between', sa.JSON(), nullable=True),
    sa.Column('date', sa.BigInteger(), nullable=True),
    sa.Column('created_at', sa.BigInteger(), nullable=True),
    sa.Column('active_status', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions')
    # ### end Alembic commands ###
