"""
Application configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Eternal Calendar NFT API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://eternalcalendar.com"
    ]
    
    # Database Configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:password@localhost:5432/eternal_calendar"
    )
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Blockchain Configuration
    IRYS_RPC_URL: str = os.getenv(
        "IRYS_RPC_URL", 
        "https://testnet-rpc.irys.xyz/v1/execution-rpc"
    )
    IRYS_CHAIN_ID: int = 1270
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")
    PRIVATE_KEY: str = os.getenv("PRIVATE_KEY", "")
    
    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
