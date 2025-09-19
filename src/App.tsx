import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from '@/config/web3';
import { Web3Provider } from '@/hooks/useWeb3';
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import UploadNFT from "./pages/UploadNFT";
import MyAssets from "./pages/MyAssets";
import RentalManagement from "./pages/RentalManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  enableAnalytics: true,
  enableOnramp: true,
});

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/upload" element={<UploadNFT />} />
                <Route path="/assets" element={<MyAssets />} />
                <Route path="/rentals" element={<RentalManagement />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
