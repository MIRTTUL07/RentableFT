-- Create table for NFT marketplace listings
CREATE TABLE public.nft_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nft_id TEXT NOT NULL,
  token_id INTEGER NOT NULL,
  contract_address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  rent_price DECIMAL(20, 8),
  is_rentable BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  seller_address TEXT NOT NULL,
  seller_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.nft_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for NFT listings
CREATE POLICY "Anyone can view available listings" 
ON public.nft_listings 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Sellers can insert their own listings" 
ON public.nft_listings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Sellers can update their own listings" 
ON public.nft_listings 
FOR UPDATE 
USING (seller_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Sellers can delete their own listings" 
ON public.nft_listings 
FOR DELETE 
USING (seller_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_nft_listings_updated_at
BEFORE UPDATE ON public.nft_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_nft_listings_seller ON public.nft_listings(seller_address);
CREATE INDEX idx_nft_listings_available ON public.nft_listings(is_available);
CREATE INDEX idx_nft_listings_category ON public.nft_listings(category);