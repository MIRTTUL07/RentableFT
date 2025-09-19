import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, Wallet, AlertTriangle } from "lucide-react";
import { useAccount, useBalance } from 'wagmi';
import { useNFTTransactions } from "@/hooks/useNFTTransactions";
import { formatEther } from 'viem';

interface RentNFTDialogProps {
  nft: {
    id: string;
    title: string;
    image: string;
    rentPrice?: string;
    owner: string;
    category: string;
  };
  children: React.ReactNode;
}

const RentNFTDialog = ({ nft, children }: RentNFTDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { rentNFT, isLoading } = useNFTTransactions();

  const totalCost = nft.rentPrice ? parseFloat(nft.rentPrice) * rentalDays : 0;
  const hasInsufficientFunds = balance && parseFloat(formatEther(balance.value)) < totalCost;

  const handleRent = async () => {
    if (!isConnected || !address || !nft.rentPrice) {
      return;
    }

    await rentNFT(nft.id, nft.rentPrice, rentalDays);
    setIsOpen(false);
  };

  if (!isConnected) {
    return (
      <Button variant="outline" size="sm" className="flex-1" disabled>
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
            <Clock className="h-5 w-5" />
            Rent NFT
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
            <div>
              <Label htmlFor="rental-days">Rental Duration (Days)</Label>
              <Input
                id="rental-days"
                type="number"
                min="1"
                max="30"
                value={rentalDays}
                onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1"
              />
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Rate</span>
              <span className="font-semibold">{nft.rentPrice} MATIC</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Cost</span>
              <span className="font-semibold text-accent">{totalCost.toFixed(4)} MATIC</span>
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
                <span className="text-sm">Insufficient funds for this rental</span>
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
              onClick={handleRent}
              disabled={isLoading || hasInsufficientFunds}
              className="flex-1"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Rent for {rentalDays} day{rentalDays > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentNFTDialog;