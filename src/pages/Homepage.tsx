import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NFTCard from "@/components/NFTCard";
import { Search, Filter, Zap } from "lucide-react";
import { useMarketplaceNFTs } from "@/hooks/useNFTs";
import heroBg from "@/assets/hero-bg.jpg";

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  
  const { nfts: marketplaceNFTs, loading } = useMarketplaceNFTs();

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || nft.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "low" && parseFloat(nft.price) < 200) ||
      (priceFilter === "medium" && parseFloat(nft.price) >= 200 && parseFloat(nft.price) < 500) ||
      (priceFilter === "high" && parseFloat(nft.price) >= 500);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] rounded-2xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Rent Gaming NFTs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, rent, and trade premium in-game assets. Unlock new gaming experiences without permanent investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gaming" size="lg" className="glow-effect">
                <Zap className="h-5 w-5 mr-2" />
                Start Renting
              </Button>
              <Button variant="outline" size="lg">
                List Your NFTs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="weapon">Weapons</SelectItem>
              <SelectItem value="armor">Armor</SelectItem>
              <SelectItem value="mount">Mounts</SelectItem>
              <SelectItem value="vehicle">Vehicles</SelectItem>
              <SelectItem value="pet">Pets</SelectItem>
              <SelectItem value="consumable">Consumables</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="low">Under 200 MATIC</SelectItem>
              <SelectItem value="medium">200-500 MATIC</SelectItem>
              <SelectItem value="high">500+ MATIC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="nft-card rounded-xl p-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : (
          filteredNFTs.map((nft) => (
            <NFTCard key={nft.id} {...nft} />
          ))
        )}
      </div>

      {!loading && filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No NFTs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;