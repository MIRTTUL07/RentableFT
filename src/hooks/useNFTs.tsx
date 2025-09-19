import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { ethers } from 'ethers';

export interface NFT {
  id: string;
  tokenId: number;
  title: string;
  description: string;
  image: string;
  price: string;
  rentPrice?: string;
  owner: string;
  isRentable: boolean;
  isAvailable: boolean;
  category: string;
  timeLeft?: string;
  contractAddress: string;
  tokenURI?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

// ERC721 ABI for basic NFT functionality
const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

// Popular NFT contracts on Polygon mainnet
const POPULAR_NFT_CONTRACTS = [
  '0x2953399124F0cBB46d2CbACD8A89cF0599974963', // OpenSea Shared Storefront
  '0x76BE3b62873462d2142405439777e971754E8E77', // Cryptoads
  '0x9E9c960A2daa0dB32aC04C801bE26c8f9223B037', // PolyPixels
  '0xd2003d6d938F50Ae69D09B2b0FC5C5D9C318b5a1', // Polygon NFT
];

const fetchTokenMetadata = async (tokenURI: string): Promise<{ name: string; description: string; image: string; }> => {
  try {
    // Handle IPFS URLs
    const url = tokenURI.startsWith('ipfs://') 
      ? `https://ipfs.io/ipfs/${tokenURI.slice(7)}`
      : tokenURI;
    
    const response = await fetch(url);
    const metadata = await response.json();
    
    return {
      name: metadata.name || 'Unnamed NFT',
      description: metadata.description || '',
      image: metadata.image?.startsWith('ipfs://') 
        ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
        : metadata.image || ''
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      name: 'Unknown NFT',
      description: '',
      image: ''
    };
  }
};

export const useNFTs = () => {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!isConnected || !address) {
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
      const fetchedNFTs: NFT[] = [];

      // Try to fetch NFTs from popular contracts
      for (const contractAddress of POPULAR_NFT_CONTRACTS.slice(0, 2)) { // Limit to prevent rate limiting
        try {
          const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
          
          const balance = await contract.balanceOf(address);
          const balanceNum = Number(balance);
          
          // Fetch up to 5 NFTs from each contract
          for (let i = 0; i < Math.min(balanceNum, 5); i++) {
            try {
              const tokenId = await contract.tokenOfOwnerByIndex(address, i);
              const tokenURI = await contract.tokenURI(tokenId);
              const metadata = await fetchTokenMetadata(tokenURI);
              
              if (metadata.image) {
                fetchedNFTs.push({
                  id: `${contractAddress}-${tokenId}`,
                  tokenId: Number(tokenId),
                  title: metadata.name,
                  description: metadata.description,
                  image: metadata.image,
                  price: '0.1',
                  owner: address,
                  contractAddress,
                  category: 'Gaming',
                  isRentable: true,
                  isAvailable: true
                });
              }
            } catch (tokenError) {
              console.log(`Error fetching token ${i}:`, tokenError);
            }
          }
        } catch (contractError) {
          console.log(`Error with contract ${contractAddress}:`, contractError);
        }
      }

      setNfts(fetchedNFTs);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [address, isConnected]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs
  };
};

export const useMarketplaceNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketplaceNFTs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('nft_listings')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching marketplace NFTs:', error);
        setNfts([]);
        return;
      }

      const marketplaceNFTs: NFT[] = data.map(listing => ({
        id: listing.nft_id,
        tokenId: listing.token_id,
        title: listing.title,
        description: listing.description || '',
        image: listing.image_url,
        price: listing.price.toString(),
        rentPrice: listing.rent_price?.toString(),
        owner: listing.seller_name || listing.seller_address,
        contractAddress: listing.contract_address,
        category: listing.category,
        isRentable: listing.is_rentable,
        isAvailable: listing.is_available
      }));
      
      setNfts(marketplaceNFTs);
    } catch (error) {
      console.error('Error fetching marketplace NFTs:', error);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceNFTs();

    // Set up real-time subscription for new listings
    const channel = supabase
      .channel('marketplace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nft_listings'
        },
        () => {
          fetchMarketplaceNFTs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    nfts,
    loading,
    refetch: fetchMarketplaceNFTs
  };
};