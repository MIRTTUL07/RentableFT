import { IPFS_GATEWAYS } from '@/config/web3';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

export const isIPFSHash = (hash: string): boolean => {
  return hash.startsWith('Qm') || hash.startsWith('bafy') || hash.includes('ipfs://');
};

export const getIPFSUrl = (hash: string): string => {
  if (!hash) return '';
  
  // Remove ipfs:// prefix if present
  const cleanHash = hash.replace('ipfs://', '');
  
  // Try different gateways for better reliability
  const gateway = IPFS_GATEWAYS[0]; // Primary gateway
  return `${gateway}${cleanHash}`;
};

export const fetchIPFSMetadata = async (tokenURI: string): Promise<NFTMetadata | null> => {
  if (!tokenURI) return null;
  
  try {
    let url = tokenURI;
    
    // Handle IPFS URLs
    if (isIPFSHash(tokenURI)) {
      url = getIPFSUrl(tokenURI);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    
    const metadata: NFTMetadata = await response.json();
    
    // Process image URL if it's IPFS
    if (metadata.image && isIPFSHash(metadata.image)) {
      metadata.image = getIPFSUrl(metadata.image);
    }
    
    // Process animation URL if it's IPFS
    if (metadata.animation_url && isIPFSHash(metadata.animation_url)) {
      metadata.animation_url = getIPFSUrl(metadata.animation_url);
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error);
    return null;
  }
};

export const uploadToIPFS = async (file: File): Promise<string> => {
  // This is a placeholder - you'll need to implement actual IPFS upload
  // using services like Pinata, Infura, or Web3.Storage
  
  try {
    // Example with Pinata (you'll need API keys)
    const formData = new FormData();
    formData.append('file', file);
    
    // You would call your backend API or Pinata directly
    // const response = await fetch('/api/pinata-upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // For now, return a mock hash
    return 'QmYourFileHashHere';
    
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

export const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
  try {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json',
    });
    
    // Similar to file upload, you'd implement actual IPFS upload here
    // For now, return a mock hash
    return 'QmYourMetadataHashHere';
    
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};