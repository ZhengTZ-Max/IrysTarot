'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, DEFAULT_MINT_PRICE, generateTarotTokenURI } from '@/lib/contract';
import { formatEther } from 'viem';

/**
 * NFT Minting component
 */
export function MintNFT() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Contract state
  const { data: mintPrice } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'mintPrice',
  });

  const { data: mintingEnabled } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'mintingEnabled',
  });

  const { data: totalSupply } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'MAX_SUPPLY',
  });

  const { data: isMintingAvailable } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'isMintingAvailable',
  });

  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  /**
   * Handle single NFT minting
   */
  const handleMintSingle = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedDate || !nftName || !nftDescription || !imageUrl) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const tokenURI = generateTarotTokenURI({
        name: nftName,
        description: nftDescription,
        image: imageUrl,
        attributes: [
          { trait_type: "Year", value: new Date(selectedDate).getFullYear() },
          { trait_type: "Month", value: new Date(selectedDate).getMonth() + 1 },
          { trait_type: "Day", value: new Date(selectedDate).getDate() },
        ]
      });

      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintNFT',
        args: [tokenURI],
        value: mintPrice || DEFAULT_MINT_PRICE,
      });
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  /**
   * Handle multiple NFT minting
   */
  const handleMintMultiple = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedDate || !nftName || !nftDescription || !imageUrl) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const tokenURIs = [];
      const startDate = new Date(selectedDate);
      
      // Generate 7 NFTs for a week starting from selected date
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const tokenURI = generateTarotTokenURI({
          name: `${nftName} - Day ${i + 1}`,
          description: `${nftDescription} - Day ${i + 1} of the week`,
          image: imageUrl,
          attributes: [
            { trait_type: "Year", value: currentDate.getFullYear() },
            { trait_type: "Month", value: currentDate.getMonth() + 1 },
            { trait_type: "Day", value: currentDate.getDate() },
            { trait_type: "Week Day", value: i + 1 },
          ]
        });
        
        tokenURIs.push(tokenURI);
      }

      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintMultipleNFTs',
        args: [tokenURIs],
        value: (mintPrice || DEFAULT_MINT_PRICE) * BigInt(7),
      });
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please connect your wallet to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mint Calendar NFT</h2>
      
      {/* Contract Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Mint Price</p>
          <p className="font-semibold">
            {mintPrice ? formatEther(mintPrice) : '0.01'} IRYS
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Supply</p>
          <p className="font-semibold">
            {totalSupply?.toString() || '0'} / {maxSupply?.toString() || '10000'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className={`font-semibold ${mintingEnabled ? 'text-green-600' : 'text-red-600'}`}>
            {mintingEnabled ? 'Minting Enabled' : 'Minting Disabled'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Available</p>
          <p className={`font-semibold ${isMintingAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {isMintingAvailable ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Mint Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Name
          </label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="My Calendar NFT"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="A unique calendar NFT for this special date"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleMintSingle}
            disabled={isPending || isConfirming || !isMintingAvailable}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isPending || isConfirming ? 'Minting...' : 'Mint Single NFT'}
          </button>

          <button
            onClick={handleMintMultiple}
            disabled={isPending || isConfirming || !isMintingAvailable}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isPending || isConfirming ? 'Minting...' : 'Mint Week (7 NFTs)'}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error.message}
          </div>
        )}

        {hash && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p>Transaction Hash: {hash}</p>
            <p>Status: {isConfirming ? 'Confirming...' : isConfirmed ? 'Confirmed!' : 'Pending'}</p>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>✅ NFT(s) minted successfully!</p>
            <p>Transaction confirmed on IRYS Testnet</p>
          </div>
        )}
      </div>
    </div>
  );
}
