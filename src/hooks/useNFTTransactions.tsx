import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const useNFTTransactions = () => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const buyNFT = async (nftId: string, price: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      toast.success('Processing purchase... Please confirm the transaction in your wallet.');
      
      // For demo purposes, we simulate a successful purchase
      setTimeout(() => {
        toast.success(`Successfully purchased NFT for ${price} MATIC!`);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Buy NFT error:', error);
      toast.error('Failed to buy NFT. Please try again.');
      setIsLoading(false);
    }
  };

  const rentNFT = async (nftId: string, rentPrice: string, days: number = 1) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      const totalCost = (parseFloat(rentPrice) * days).toFixed(4);
      toast.success('Processing rental... Please confirm the transaction in your wallet.');
      
      // For demo purposes, we simulate a successful rental
      setTimeout(() => {
        toast.success(`Successfully rented NFT for ${totalCost} MATIC for ${days} day${days > 1 ? 's' : ''}!`);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Rent NFT error:', error);
      toast.error('Failed to rent NFT. Please try again.');
      setIsLoading(false);
    }
  };

  const listForSale = async (nftData: {
    contractAddr: string;
    tokenId: number;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: string;
    rentPrice?: string;
    isRentable?: boolean;
  }) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      toast.success('Listing NFT for sale...');
      
      const { error } = await supabase
        .from('nft_listings')
        .insert({
          nft_id: `${nftData.contractAddr}-${nftData.tokenId}`,
          token_id: nftData.tokenId,
          contract_address: nftData.contractAddr,
          title: nftData.title,
          description: nftData.description,
          image_url: nftData.image,
          category: nftData.category,
          price: parseFloat(nftData.price),
          rent_price: nftData.rentPrice ? parseFloat(nftData.rentPrice) : null,
          is_rentable: nftData.isRentable || false,
          seller_address: address,
          seller_name: address
        });

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to list NFT for sale.');
        setIsLoading(false);
        return;
      }
      
      toast.success(`Successfully listed NFT for ${nftData.price} MATIC!`);
      setIsLoading(false);
      
    } catch (error) {
      console.error('List for sale error:', error);
      toast.error('Failed to list NFT for sale.');
      setIsLoading(false);
    }
  };

  return {
    buyNFT,
    rentNFT,
    listForSale,
    isLoading: isLoading || isPending || isConfirming,
  };
};