"""
Event endpoints for blockchain events
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.nft import NFT, NFTResponse
from app.services.blockchain import BlockchainService
import json

router = APIRouter()


@router.get("/minted")
async def get_minted_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get recent NFT minting events"""
    nfts = db.query(NFT).filter(
        NFT.is_active == True
    ).order_by(NFT.minted_at.desc()).offset(skip).limit(limit).all()
    
    # Parse metadata JSON strings
    for nft in nfts:
        if nft.metadata:
            try:
                nft.metadata = json.loads(nft.metadata)
            except:
                nft.metadata = None
    
    return {
        "events": nfts,
        "total": len(nfts),
        "skip": skip,
        "limit": limit
    }


@router.get("/recent")
async def get_recent_events(
    hours: int = Query(24, ge=1, le=168),  # Last 24 hours by default, max 1 week
    db: Session = Depends(get_db)
):
    """Get events from the last N hours"""
    from datetime import datetime, timedelta
    
    cutoff_time = datetime.utcnow() - timedelta(hours=hours)
    
    nfts = db.query(NFT).filter(
        NFT.is_active == True,
        NFT.minted_at >= cutoff_time
    ).order_by(NFT.minted_at.desc()).all()
    
    # Parse metadata JSON strings
    for nft in nfts:
        if nft.metadata:
            try:
                nft.metadata = json.loads(nft.metadata)
            except:
                nft.metadata = None
    
    return {
        "events": nfts,
        "total": len(nfts),
        "time_range_hours": hours,
        "cutoff_time": cutoff_time.isoformat()
    }


@router.get("/stats")
async def get_event_stats(db: Session = Depends(get_db)):
    """Get event statistics"""
    from datetime import datetime, timedelta
    from sqlalchemy import func
    
    # Total events
    total_events = db.query(NFT).filter(NFT.is_active == True).count()
    
    # Events in last 24 hours
    last_24h = datetime.utcnow() - timedelta(hours=24)
    events_24h = db.query(NFT).filter(
        NFT.is_active == True,
        NFT.minted_at >= last_24h
    ).count()
    
    # Events in last week
    last_week = datetime.utcnow() - timedelta(days=7)
    events_week = db.query(NFT).filter(
        NFT.is_active == True,
        NFT.minted_at >= last_week
    ).count()
    
    # Events by day (last 7 days)
    daily_events = []
    for i in range(7):
        day_start = datetime.utcnow() - timedelta(days=i+1)
        day_end = datetime.utcnow() - timedelta(days=i)
        
        count = db.query(NFT).filter(
            NFT.is_active == True,
            NFT.minted_at >= day_start,
            NFT.minted_at < day_end
        ).count()
        
        daily_events.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "count": count
        })
    
    return {
        "total_events": total_events,
        "events_24h": events_24h,
        "events_week": events_week,
        "daily_events": daily_events
    }
