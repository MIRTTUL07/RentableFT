import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wallet, Image, Zap, DollarSign } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useNFTTransactions } from "@/hooks/useNFTTransactions";
import { toast } from "sonner";

const UploadNFT = () => {
  const { isConnected, connect } = useWeb3();
  const { listForSale, isLoading } = useNFTTransactions();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isRentable: false,
    rentPrice: "",
    rentDuration: "daily",
    collateral: "",
    image: null as File | null,
    contractAddress: "",
    tokenId: ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.price || !formData.category || !formData.contractAddress || !formData.tokenId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!imagePreview) {
      toast.error("Please upload an image");
      return;
    }

    await listForSale({
      contractAddr: formData.contractAddress,
      tokenId: parseInt(formData.tokenId),
      title: formData.name,
      description: formData.description,
      image: imagePreview,
      category: formData.category,
      price: formData.price,
      rentPrice: formData.isRentable ? formData.rentPrice : undefined,
      isRentable: formData.isRentable
    });

    // Reset form on success
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      isRentable: false,
      rentPrice: "",
      rentDuration: "daily",
      collateral: "",
      image: null,
      contractAddress: "",
      tokenId: ""
    });
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">List Your NFT</h1>
        <p className="text-muted-foreground text-lg">
          Upload your gaming asset and set it up for sale or rent on the marketplace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Asset Image
              </CardTitle>
              <CardDescription>
                Upload an image of your gaming asset. Supported formats: JPG, PNG, GIF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          Choose File
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Or drag and drop your image here
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
              <CardDescription>
                Provide information about your gaming asset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Legendary Fire Sword"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your asset's features and benefits..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weapon">Weapon</SelectItem>
                    <SelectItem value="Armor">Armor</SelectItem>
                    <SelectItem value="Mount">Mount</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Pet">Pet</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contractAddress">Contract Address *</Label>
                <Input
                  id="contractAddress"
                  value={formData.contractAddress}
                  onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                  placeholder="0x..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="tokenId">Token ID *</Label>
                <Input
                  id="tokenId"
                  type="number"
                  value={formData.tokenId}
                  onChange={(e) => setFormData({ ...formData, tokenId: e.target.value })}
                  placeholder="1"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing & Rental Options
            </CardTitle>
            <CardDescription>
              Set your sale price and rental terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Sale Price (MATIC) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="rentable"
                checked={formData.isRentable}
                onCheckedChange={(checked) => setFormData({ ...formData, isRentable: checked })}
              />
              <Label htmlFor="rentable" className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                Enable Rental
              </Label>
            </div>

            {formData.isRentable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="rentPrice">Rent Price (MATIC)</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    step="0.01"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="rentDuration">Per</Label>
                  <Select value={formData.rentDuration} onValueChange={(value) => setFormData({ ...formData, rentDuration: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Day</SelectItem>
                      <SelectItem value="weekly">Week</SelectItem>
                      <SelectItem value="monthly">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="collateral">Collateral (MATIC)</Label>
                  <Input
                    id="collateral"
                    type="number"
                    step="0.01"
                    value={formData.collateral}
                    onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isConnected ? (
            <Button 
              type="button" 
              onClick={connect}
              variant="outline" 
              size="lg"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet First
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="gaming" 
              size="lg" 
              className="glow-effect"
              disabled={isLoading}
            >
              <Zap className="h-5 w-5 mr-2" />
              {isLoading ? "Listing..." : "List NFT"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadNFT;