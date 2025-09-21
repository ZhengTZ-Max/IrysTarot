"""
NFT data models
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

Base = declarative_base()


class NFT(Base):
    """NFT database model"""
    __tablename__ = "nfts"
    
    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(BigInteger, unique=True, index=True, nullable=False)
    owner_address = Column(String(42), nullable=False, index=True)
    token_uri = Column(Text, nullable=False)
    metadata = Column(Text)  # JSON string
    minted_at = Column(DateTime(timezone=True), server_default=func.now())
    transaction_hash = Column(String(66), nullable=False, index=True)
    block_number = Column(BigInteger, nullable=False)
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<NFT(token_id={self.token_id}, owner={self.owner_address})>"


class NFTCreate(BaseModel):
    """NFT creation request model"""
    token_id: int
    owner_address: str
    token_uri: str
    metadata: Optional[Dict[str, Any]] = None
    transaction_hash: str
    block_number: int


class NFTResponse(BaseModel):
    """NFT response model"""
    id: int
    token_id: int
    owner_address: str
    token_uri: str
    metadata: Optional[Dict[str, Any]] = None
    minted_at: datetime
    transaction_hash: str
    block_number: int
    is_active: bool
    
    class Config:
        from_attributes = True


class NFTMetadata(BaseModel):
    """NFT metadata model"""
    name: str
    description: str
    image: str
    attributes: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class MintRequest(BaseModel):
    """NFT minting request model"""
    date: str
    name: str
    description: str
    image_url: str
    attributes: Optional[List[Dict[str, Any]]] = None


class MintResponse(BaseModel):
    """NFT minting response model"""
    success: bool
    token_id: Optional[int] = None
    transaction_hash: Optional[str] = None
    message: str
