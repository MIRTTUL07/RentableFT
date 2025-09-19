import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, User, Settings, ChevronDown } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useWeb3Modal } from '@web3modal/wagmi/react';

const Navigation = () => {
  const location = useLocation();
  const { isConnected, address, balance, isCorrectChain, switchToPolygon } = useWeb3();
  const { open } = useWeb3Modal();

  const navItems = [
    { path: "/", label: "Marketplace", icon: null },
    { path: "/upload", label: "List NFT", icon: Plus },
    { path: "/assets", label: "My Assets", icon: User },
    { path: "/rentals", label: "Rentals", icon: Settings },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold gradient-text">
              RentableFT
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                      isActive
                        ? "text-primary-glow bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <>
                <Button variant="gaming" size="sm" className="hidden sm:flex" onClick={() => open()}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
                <Button variant="gaming" size="sm" className="sm:hidden" onClick={() => open()}>
                  <Wallet className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {!isCorrectChain && (
                  <Button variant="destructive" size="sm" onClick={switchToPolygon}>
                    Switch to Polygon
                  </Button>
                )}
                <div className="flex items-center space-x-2 px-3 py-2 bg-card rounded-lg border">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <div className="hidden sm:flex flex-col text-xs">
                    <span className="text-foreground font-medium">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <span className="text-muted-foreground">{balance}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => open()}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium transition-colors rounded-md ${
                    isActive
                      ? "text-primary-glow bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.icon && <item.icon className="h-3 w-3" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;