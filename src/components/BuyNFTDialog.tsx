import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Wallet, AlertTriangle } from "lucide-react";
import { useAccount, useBalance } from 'wagmi';
import { useNFTTransactions } from "@/hooks/useNFTTransactions";
import { formatEther } from 'viem';

interface BuyNFTDialogProps {
  nft: {
    id: string;
    title: string;
    image: string;
    price: string;
    owner: string;
    category: string;
  };
  children: React.ReactNode;
}

const BuyNFTDialog = ({ nft, children }: BuyNFTDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { buyNFT, isLoading } = useNFTTransactions();

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      return;
    }

    await buyNFT(nft.id, nft.price);
    setIsOpen(false);
  };

  const hasInsufficientFunds = balance && parseFloat(formatEther(balance.value)) < parseFloat(nft.price);

  if (!isConnected) {
    return (
      <Button variant="gaming" size="sm" className="flex-1" disabled>
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase NFT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <img 
              src={nft.image} 
              alt={nft.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{nft.title}</h3>
              <Badge variant="outline" className="text-xs">{nft.category}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">{nft.price} MATIC</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Balance</span>
              <span className="font-mono text-sm">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '0.0000 MATIC'}
              </span>
            </div>

            {hasInsufficientFunds && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Insufficient funds for this purchase</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="gaming"
              onClick={handlePurchase}
              disabled={isLoading || hasInsufficientFunds}
              className="flex-1"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;