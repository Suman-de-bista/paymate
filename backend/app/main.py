from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth, groups, transaction
from backend.app.routes import qrdetail

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(transaction.router, prefix="/transaction", tags=["transaction"])
app.include_router(qrdetail.router, prefix="/qr", tags=["qr"]) 