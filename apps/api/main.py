"""
Eternal Calendar NFT API
FastAPI backend for NFT minting dApp on IRYS Testnet
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import nft, events, health
from app.services.blockchain import BlockchainService
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await init_db()
    blockchain_service = BlockchainService()
    await blockchain_service.start_event_listener()
    yield
    # Shutdown
    await blockchain_service.stop_event_listener()


# Create FastAPI app
app = FastAPI(
    title="Eternal Calendar NFT API",
    description="Backend API for NFT minting dApp on IRYS Testnet",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(nft.router, prefix="/api/nft", tags=["nft"])
app.include_router(events.router, prefix="/api/events", tags=["events"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Eternal Calendar NFT API",
        "version": "1.0.0",
        "chain": "IRYS Testnet",
        "status": "running"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
