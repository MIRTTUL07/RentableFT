import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, polygon, sepolia, polygonMumbai } from 'wagmi/chains';

// Get project ID from WalletConnect Cloud
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id';

const metadata = {
  name: 'RentableFT',
  description: 'NFT Rental Marketplace',
  url: 'https://rentableft.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmi config
export const config = defaultWagmiConfig({
  chains: [polygon, mainnet, sepolia, polygonMumbai],
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Contract addresses (update with your deployed contracts)
export const CONTRACTS = {
  NFT_RENTAL: {
    [polygon.id]: '0x...', // Deploy your contract here
    [polygonMumbai.id]: '0x...', // Testnet contract
  },
  NFT_MARKETPLACE: {
    [polygon.id]: '0x...', // Deploy your contract here  
    [polygonMumbai.id]: '0x...', // Testnet contract
  },
};

// IPFS gateways
export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];