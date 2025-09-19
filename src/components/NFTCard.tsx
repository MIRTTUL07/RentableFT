import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Zap } from "lucide-react";
import BuyNFTDialog from "./BuyNFTDialog";
import RentNFTDialog from "./RentNFTDialog";

interface NFTCardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  rentPrice?: string;
  owner: string;
  isRentable: boolean;
  isAvailable: boolean;
  category: string;
  timeLeft?: string;
}

const NFTCard = ({ 
  id,
  title, 
  image, 
  price, 
  rentPrice, 
  owner, 
  isRentable, 
  isAvailable, 
  category,
  timeLeft 
}: NFTCardProps) => {
  return (
    <div className="nft-card rounded-xl p-4 group cursor-pointer">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        <div className="absolute top-2 left-2">
          <Badge variant={isRentable ? "secondary" : "outline"} className="text-xs">
            {category}
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2">
          {isRentable && (
            <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
              <Zap className="h-3 w-3 mr-1" />
              Rentable
            </Badge>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Rented</Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-glow transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span className="truncate">{owner}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Buy Price</span>
            <span className="font-semibold text-secondary">{price} MATIC</span>
          </div>
          
          {isRentable && rentPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rent/Day</span>
              <span className="font-semibold text-accent">{rentPrice} MATIC</span>
            </div>
          )}

          {timeLeft && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <BuyNFTDialog 
            nft={{ 
              id, 
              title, 
              image, 
              price, 
              owner, 
              category 
            }}
          >
            <Button variant="gaming" size="sm" className="flex-1">
              Buy Now
            </Button>
          </BuyNFTDialog>
          {isRentable && isAvailable && (
            <RentNFTDialog 
              nft={{ 
                id, 
                title, 
                image, 
                rentPrice, 
                owner, 
                category 
              }}
            >
              <Button variant="outline" size="sm" className="flex-1">
                Rent
              </Button>
            </RentNFTDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;