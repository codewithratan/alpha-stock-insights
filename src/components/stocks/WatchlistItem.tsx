
import { StockData } from "@/lib/stock-data";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistItemProps {
  stock: StockData;
}

export default function WatchlistItem({ stock }: WatchlistItemProps) {
  // Each item can be clicked to select the stock
  const isPositive = stock.change >= 0;

  return (
    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer transition-colors">
      <div className="flex flex-col">
        <span className="font-medium">{stock.symbol}</span>
        <span className="text-xs text-muted-foreground">{stock.companyName.substring(0, 20)}{stock.companyName.length > 20 ? '...' : ''}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium">${stock.currentPrice.toFixed(2)}</span>
        <span className={cn(
          "text-xs flex items-center",
          isPositive ? "text-finance-green" : "text-finance-red"
        )}>
          {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
          {Math.abs(stock.changePercent).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
