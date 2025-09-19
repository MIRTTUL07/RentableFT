import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NFTCard from "@/components/NFTCard";
import { useNFTs } from "@/hooks/useNFTs";
import { useWeb3 } from "@/hooks/useWeb3";
import { Wallet, Package, Clock, TrendingUp } from "lucide-react";

const MyAssets = () => {
  const { isConnected, address } = useWeb3();
  const { nfts: ownedNFTs, loading, error } = useNFTs();
  
  // Mock rented NFTs for now - you'd fetch these from your rental contract
  const rentedNFTs = [
    {
      id: "rented-1",
      title: "Fire Dragon Mount #256",
      image: "/src/assets/nft-dragon.jpg",
      price: "500",
      rentPrice: "20",
      owner: "0x742d35Cc...4280400",
      isRentable: true,
      isAvailable: false,
      category: "Mount",
      timeLeft: "2d 8h",
    },
  ];

  const stats = {
    totalOwned: ownedNFTs.length,
    totalRented: rentedNFTs.length,
    totalEarnings: "156.5", // Mock earnings - calculate from rental history
    activeListings: ownedNFTs.filter(nft => nft.isRentable && nft.isAvailable).length,
  };

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Assets</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Connect your wallet to view your NFT portfolio
          </p>
          <Button variant="gaming" size="lg" onClick={() => {}}>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Assets</h1>
          <p className="text-muted-foreground text-lg">Loading your NFTs...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Assets</h1>
          <p className="text-destructive text-lg">{error}</p>
          <Button variant="gaming" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">My Assets</h1>
        <p className="text-muted-foreground text-lg">
          Manage your NFT portfolio and track your rental earnings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owned NFTs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOwned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Renting</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRented}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarnings} MATIC</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Tabs */}
      <Tabs defaultValue="owned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="owned">Owned NFTs ({ownedNFTs.length})</TabsTrigger>
          <TabsTrigger value="rented">Currently Renting ({rentedNFTs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-semibold">Your NFT Collection</h3>
              <p className="text-muted-foreground">NFTs you own and can list for sale or rent</p>
            </div>
            <Button variant="gaming">
              List New NFT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ownedNFTs.length > 0 ? (
              ownedNFTs.map((nft) => (
                <div key={nft.id} className="relative">
                  <NFTCard {...nft} />
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Owned
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardHeader>
                    <CardTitle>No NFTs Yet</CardTitle>
                    <CardDescription>
                      Start building your collection by purchasing or minting NFTs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="gaming">Browse Marketplace</Button>
                      <Button variant="outline">Mint New NFT</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rented" className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">Currently Renting</h3>
            <p className="text-muted-foreground">NFTs you are currently renting from other users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rentedNFTs.map((nft) => (
              <div key={nft.id} className="relative">
                <NFTCard {...nft} />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Renting
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {rentedNFTs.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Active Rentals</CardTitle>
                <CardDescription>
                  Browse the marketplace to find NFTs you can rent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="gaming">Browse Rentals</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyAssets;