"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.blockchain import BlockchainService

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "Eternal Calendar NFT API",
        "version": "1.0.0"
    }


@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check including database and blockchain"""
    blockchain_service = BlockchainService()
    
    # Check database connection
    db_status = "healthy"
    try:
        db.execute("SELECT 1")
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check blockchain connection
    blockchain_status = "healthy" if blockchain_service.is_connected() else "unhealthy"
    latest_block = blockchain_service.get_latest_block()
    
    return {
        "status": "healthy" if db_status == "healthy" and blockchain_status == "healthy" else "unhealthy",
        "database": db_status,
        "blockchain": blockchain_status,
        "latest_block": latest_block,
        "chain_id": 1270,
        "chain_name": "IRYS Testnet"
    }
