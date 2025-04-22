
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import WatchlistItem from "@/components/stocks/WatchlistItem";
import { popularStocks, StockData } from "@/lib/stock-data";

interface SidebarProps {
  className?: string;
  onStockSelect?: (stock: StockData) => void;
}

export default function Sidebar({ className, onStockSelect }: SidebarProps) {
  const [selectedTab, setSelectedTab] = useState<'watchlist' | 'market'>('watchlist');
  
  // Handle stock selection
  const handleStockClick = (stock: StockData) => {
    if (onStockSelect) {
      onStockSelect(stock);
    }
  };
  
  return (
    <div className={cn("flex flex-col border-r bg-sidebar", className)}>
      <div className="p-4 flex justify-around border-b">
        <Button
          variant={selectedTab === 'watchlist' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('watchlist')}
          className="flex-1"
        >
          Watchlist
        </Button>
        <Button
          variant={selectedTab === 'market' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('market')}
          className="flex-1"
        >
          Market
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {selectedTab === 'watchlist' ? (
          <div className="p-4 space-y-2">
            {popularStocks.slice(0, 5).map(stock => (
              <div key={stock.symbol} onClick={() => handleStockClick(stock)}>
                <WatchlistItem stock={stock} />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-primary">
              + Add Stock
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <div className="text-sm font-medium">Trending Stocks</div>
            {popularStocks.map(stock => (
              <div key={stock.symbol} onClick={() => handleStockClick(stock)}>
                <WatchlistItem stock={stock} />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
