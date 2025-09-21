"""
Blockchain service for interacting with IRYS Testnet
"""

import asyncio
import json
from typing import Optional, Dict, Any
from web3 import Web3
from web3.middleware import geth_poa_middleware
from app.core.config import settings
from app.database import get_db
from app.models.nft import NFT, NFTCreate
from sqlalchemy.orm import Session


class BlockchainService:
    """Service for blockchain interactions"""
    
    def __init__(self):
        """Initialize blockchain service"""
        self.w3 = Web3(Web3.HTTPProvider(settings.IRYS_RPC_URL))
        
        # Add PoA middleware for IRYS
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        self.contract_address = settings.CONTRACT_ADDRESS
        self.private_key = settings.PRIVATE_KEY
        self.account = self.w3.eth.account.from_key(self.private_key) if self.private_key else None
        
        # Contract ABI (simplified)
        self.contract_abi = [
            {
                "anonymous": False,
                "inputs": [
                    {"indexed": True, "internalType": "address", "name": "to", "type": "address"},
                    {"indexed": True, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
                    {"indexed": False, "internalType": "string", "name": "tokenURI", "type": "string"}
                ],
                "name": "NFTMinted",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "mintPrice",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=self.contract_abi
        ) if self.contract_address else None
        
        self.event_listener_task = None
        self.is_listening = False
    
    async def start_event_listener(self):
        """Start listening for contract events"""
        if not self.contract or self.is_listening:
            return
            
        self.is_listening = True
        self.event_listener_task = asyncio.create_task(self._listen_for_events())
    
    async def stop_event_listener(self):
        """Stop listening for contract events"""
        self.is_listening = False
        if self.event_listener_task:
            self.event_listener_task.cancel()
            try:
                await self.event_listener_task
            except asyncio.CancelledError:
                pass
    
    async def _listen_for_events(self):
        """Listen for NFT minting events"""
        if not self.contract:
            return
            
        # Get the latest block
        latest_block = self.w3.eth.get_block('latest')
        from_block = latest_block.number - 100  # Listen to last 100 blocks
        
        while self.is_listening:
            try:
                # Get new events
                events = self.contract.events.NFTMinted.get_logs(
                    fromBlock=from_block,
                    toBlock='latest'
                )
                
                for event in events:
                    await self._handle_nft_minted_event(event)
                
                from_block = latest_block.number + 1
                latest_block = self.w3.eth.get_block('latest')
                
                # Wait before next check
                await asyncio.sleep(10)
                
            except Exception as e:
                print(f"Error in event listener: {e}")
                await asyncio.sleep(30)
    
    async def _handle_nft_minted_event(self, event):
        """Handle NFT minted event"""
        try:
            # Extract event data
            token_id = event.args.tokenId
            owner_address = event.args.to
            token_uri = event.args.tokenURI
            
            # Get transaction details
            tx_hash = event.transactionHash.hex()
            block_number = event.blockNumber
            
            # Create NFT record
            nft_data = NFTCreate(
                token_id=token_id,
                owner_address=owner_address,
                token_uri=token_uri,
                transaction_hash=tx_hash,
                block_number=block_number
            )
            
            # Save to database
            await self._save_nft_to_db(nft_data)
            
            print(f"NFT minted: Token ID {token_id} to {owner_address}")
            
        except Exception as e:
            print(f"Error handling NFT minted event: {e}")
    
    async def _save_nft_to_db(self, nft_data: NFTCreate):
        """Save NFT data to database"""
        try:
            db = next(get_db())
            nft = NFT(
                token_id=nft_data.token_id,
                owner_address=nft_data.owner_address,
                token_uri=nft_data.token_uri,
                metadata=json.dumps(nft_data.metadata) if nft_data.metadata else None,
                transaction_hash=nft_data.transaction_hash,
                block_number=nft_data.block_number
            )
            db.add(nft)
            db.commit()
            db.refresh(nft)
        except Exception as e:
            print(f"Error saving NFT to database: {e}")
        finally:
            db.close()
    
    def get_mint_price(self) -> Optional[int]:
        """Get current mint price from contract"""
        if not self.contract:
            return None
        try:
            return self.contract.functions.mintPrice().call()
        except Exception as e:
            print(f"Error getting mint price: {e}")
            return None
    
    def get_total_supply(self) -> Optional[int]:
        """Get total supply from contract"""
        if not self.contract:
            return None
        try:
            return self.contract.functions.totalSupply().call()
        except Exception as e:
            print(f"Error getting total supply: {e}")
            return None
    
    def is_connected(self) -> bool:
        """Check if connected to blockchain"""
        try:
            return self.w3.is_connected()
        except:
            return False
    
    def get_latest_block(self) -> Optional[int]:
        """Get latest block number"""
        try:
            return self.w3.eth.get_block('latest').number
        except:
            return None
