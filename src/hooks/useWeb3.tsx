import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { polygon } from 'wagmi/chains';

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number;
  balance: string;
  connect: () => void;
  disconnect: () => void;
  isCorrectChain: boolean;
  switchToPolygon: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [isCorrectChain, setIsCorrectChain] = useState(false);

  const { data: balance } = useBalance({
    address: address,
    chainId: polygon.id,
  });

  useEffect(() => {
    setIsCorrectChain(chainId === polygon.id);
  }, [chainId]);

  const handleConnect = () => {
    const injectedConnector = connectors.find(
      (connector) => connector.name === 'MetaMask' || connector.type === 'injected'
    );
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const switchToPolygon = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Polygon chainId in hex
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  rpcUrls: ['https://polygon-rpc.com/'],
                  blockExplorerUrls: ['https://polygonscan.com/'],
                },
              ],
            });
          } catch (addError) {
            console.error('Failed to add Polygon network:', addError);
          }
        }
        console.error('Failed to switch to Polygon network:', switchError);
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        chainId,
        balance: balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 MATIC',
        connect: handleConnect,
        disconnect,
        isCorrectChain,
        switchToPolygon,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}