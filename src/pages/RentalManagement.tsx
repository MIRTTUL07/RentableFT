import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, DollarSign, User, Zap, AlertCircle } from "lucide-react";
import nftSword from "@/assets/nft-sword.jpg";
import nftDragon from "@/assets/nft-dragon.jpg";

const RentalManagement = () => {
  // Mock rental data
  const activeRentals = [
    {
      id: "1",
      nftTitle: "Legendary Fire Sword",
      nftImage: nftSword,
      renter: "0x742d...356c",
      rentPrice: "2.1",
      dailyRate: "2.1",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      daysLeft: 2,
      totalEarning: "8.4",
      status: "active"
    }
  ];

  const completedRentals = [
    {
      id: "2",
      nftTitle: "Majestic Dragon Mount",
      nftImage: nftDragon,
      renter: "0x893f...128a",
      rentPrice: "6.5",
      dailyRate: "6.5", 
      startDate: "2024-01-01",
      endDate: "2024-01-07",
      daysRented: 7,
      totalEarning: "45.5",
      status: "completed"
    }
  ];

  const pendingRequests = [];

  const totalStats = {
    totalEarnings: "53.9",
    activeRentals: activeRentals.length,
    completedRentals: completedRentals.length,
    averageRating: "4.8"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Rental Management</h1>
        <p className="text-muted-foreground text-lg">
          Track and manage your NFT rentals and earnings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{totalStats.totalEarnings} MATIC</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeRentals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.completedRentals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">⭐ {totalStats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rental Management Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeRentals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRentals.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Active Rentals</h3>
            <p className="text-muted-foreground">Currently rented out NFTs and their details</p>
          </div>

          {activeRentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={rental.nftImage} 
                      alt={rental.nftTitle}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{rental.nftTitle}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        Rented by {rental.renter}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    <Zap className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Rate</p>
                    <p className="font-semibold text-lg">{rental.dailyRate} MATIC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-semibold">{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Left</p>
                    <p className="font-semibold text-accent">{rental.daysLeft} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earning</p>
                    <p className="font-semibold text-accent">{rental.totalEarning} MATIC</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Contact Renter</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeRentals.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  No Active Rentals
                </CardTitle>
                <CardDescription>
                  You don't have any NFTs currently being rented
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="gaming">List NFT for Rent</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Completed Rentals</h3>
            <p className="text-muted-foreground">History of past rental transactions</p>
          </div>

          {completedRentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={rental.nftImage} 
                      alt={rental.nftTitle}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{rental.nftTitle}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        Rented by {rental.renter}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Rate</p>
                    <p className="font-semibold">{rental.dailyRate} MATIC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-semibold">{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{rental.daysRented} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="font-semibold text-accent">{rental.totalEarning} MATIC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Pending Requests</h3>
            <p className="text-muted-foreground">NFT rental requests awaiting your approval</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                No Pending Requests
              </CardTitle>
              <CardDescription>
                All rental requests have been processed
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentalManagement;