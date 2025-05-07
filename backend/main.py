import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from alembic.config import Config
from alembic import command
from app.routes import users
from app.routes import auths


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run Alembic upgrade in a background thread to avoid blocking
    await asyncio.to_thread(run_migrations)
    yield  # App continues to start

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

app = FastAPI(
    title="PayMate",
    lifespan=lifespan,
    debug=True
)


@app.get('/')
async def get_main():
    return {"status":200, "message":"Welcome to PayMate"}




app.include_router(auths.router,prefix="/auth",tags=["auth"])
app.include_router(users.router,prefix="/users",tags=["users"])