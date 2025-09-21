'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/lib/contract';
import { useState, useEffect } from 'react';

/**
 * NFT Gallery component to display user's NFTs
 */
export function NFTGallery() {
  const { address, isConnected } = useAccount();
  const [userNFTs, setUserNFTs] = useState<Array<{
    tokenId: string;
    tokenURI: string;
    metadata?: {
      name: string;
      description: string;
      image: string;
      attributes: Array<{ trait_type: string; value: string | number }>;
    };
  }>>([]);

  // Get user's NFT balance
  const { data: balance } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  /**
   * Fetch user's NFTs
   */
  const fetchUserNFTs = async () => {
    if (!address || !balance) return;

    const nfts = [];
    for (let i = 0; i < Number(balance); i++) {
      try {
        // Get token ID by index (this would require additional contract functions)
        // For now, we'll simulate with a range
        const tokenId = i + 1;
        
        // Get token URI
        const tokenURI = await fetch(`/api/nft/${tokenId}`).then(res => res.text());
        
        // Parse metadata
        const metadata = JSON.parse(tokenURI);
        
        nfts.push({
          tokenId: tokenId.toString(),
          tokenURI,
          metadata
        });
      } catch (error) {
        console.error(`Error fetching NFT ${i}:`, error);
      }
    }
    
    setUserNFTs(nfts);
  };

  useEffect(() => {
    if (isConnected && address && balance) {
      fetchUserNFTs();
    }
  }, [isConnected, address, balance]);

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please connect your wallet to view your NFTs</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Calendar NFTs</h2>
      
      {balance && Number(balance) === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No NFTs found</p>
          <p className="text-gray-500">Mint your first calendar NFT to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft) => (
            <div key={nft.tokenId} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200">
                {nft.metadata?.image ? (
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {nft.metadata?.name || `Calendar NFT #${nft.tokenId}`}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {nft.metadata?.description || 'A unique calendar NFT'}
                </p>
                
                {nft.metadata?.attributes && (
                  <div className="space-y-1">
                    {nft.metadata.attributes.slice(0, 3).map((attr: { trait_type: string; value: string | number }, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-500">{attr.trait_type}:</span>
                        <span className="text-gray-800 font-medium">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Token ID: {nft.tokenId}</span>
                    <a
                      href={`https://explorer.irys.xyz/token/${CONTRACT_CONFIG.address}/${nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
