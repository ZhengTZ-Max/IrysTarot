"""
NFT endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.nft import NFT, NFTResponse, MintRequest, MintResponse
from app.services.blockchain import BlockchainService
import json

router = APIRouter()


@router.get("/", response_model=List[NFTResponse])
async def get_nfts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    owner_address: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get list of NFTs with optional filtering"""
    query = db.query(NFT).filter(NFT.is_active == True)
    
    if owner_address:
        query = query.filter(NFT.owner_address == owner_address)
    
    nfts = query.offset(skip).limit(limit).all()
    
    # Parse metadata JSON strings
    for nft in nfts:
        if nft.metadata:
            try:
                nft.metadata = json.loads(nft.metadata)
            except:
                nft.metadata = None
    
    return nfts


@router.get("/{token_id}", response_model=NFTResponse)
async def get_nft(token_id: int, db: Session = Depends(get_db)):
    """Get specific NFT by token ID"""
    nft = db.query(NFT).filter(
        NFT.token_id == token_id,
        NFT.is_active == True
    ).first()
    
    if not nft:
        raise HTTPException(status_code=404, detail="NFT not found")
    
    # Parse metadata JSON string
    if nft.metadata:
        try:
            nft.metadata = json.loads(nft.metadata)
        except:
            nft.metadata = None
    
    return nft


@router.get("/owner/{owner_address}", response_model=List[NFTResponse])
async def get_nfts_by_owner(
    owner_address: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get NFTs owned by specific address"""
    nfts = db.query(NFT).filter(
        NFT.owner_address == owner_address,
        NFT.is_active == True
    ).offset(skip).limit(limit).all()
    
    # Parse metadata JSON strings
    for nft in nfts:
        if nft.metadata:
            try:
                nft.metadata = json.loads(nft.metadata)
            except:
                nft.metadata = None
    
    return nfts


@router.get("/stats/overview")
async def get_nft_stats(db: Session = Depends(get_db)):
    """Get NFT statistics"""
    blockchain_service = BlockchainService()
    
    # Database stats
    total_nfts = db.query(NFT).filter(NFT.is_active == True).count()
    
    # Blockchain stats
    mint_price = blockchain_service.get_mint_price()
    total_supply = blockchain_service.get_total_supply()
    
    return {
        "total_nfts": total_nfts,
        "mint_price_wei": mint_price,
        "mint_price_eth": mint_price / 10**18 if mint_price else None,
        "total_supply": total_supply,
        "max_supply": 10000,
        "chain_id": 1270,
        "chain_name": "IRYS Testnet"
    }


@router.post("/metadata/{token_id}")
async def update_nft_metadata(
    token_id: int,
    metadata: dict,
    db: Session = Depends(get_db)
):
    """Update NFT metadata (admin only)"""
    nft = db.query(NFT).filter(NFT.token_id == token_id).first()
    
    if not nft:
        raise HTTPException(status_code=404, detail="NFT not found")
    
    nft.metadata = json.dumps(metadata)
    db.commit()
    
    return {"message": "Metadata updated successfully"}


@router.get("/metadata/{token_id}")
async def get_nft_metadata(token_id: int, db: Session = Depends(get_db)):
    """Get NFT metadata"""
    nft = db.query(NFT).filter(
        NFT.token_id == token_id,
        NFT.is_active == True
    ).first()
    
    if not nft:
        raise HTTPException(status_code=404, detail="NFT not found")
    
    metadata = None
    if nft.metadata:
        try:
            metadata = json.loads(nft.metadata)
        except:
            metadata = {"error": "Invalid metadata format"}
    
    return {
        "token_id": token_id,
        "token_uri": nft.token_uri,
        "metadata": metadata,
        "owner_address": nft.owner_address,
        "minted_at": nft.minted_at
    }
