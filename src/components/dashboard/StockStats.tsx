
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from "@/lib/stock-data";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";

interface StockStatsProps {
  stock: StockData;
}

const StockStats: React.FC<StockStatsProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stock.marketCap)}
          </div>
          <p className="text-xs text-muted-foreground">
            USD
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stock.volume)}
          </div>
          <p className="text-xs text-muted-foreground">
            Shares
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">52W High</CardTitle>
          <ArrowUp className="h-4 w-4 text-finance-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stock.high52Week.toFixed(2)}</div>
          <p className={cn(
            "text-xs flex items-center",
            (stock.currentPrice / stock.high52Week) > 0.9 
              ? "text-finance-green" 
              : "text-muted-foreground"
          )}>
            {(((stock.high52Week - stock.currentPrice) / stock.high52Week) * 100).toFixed(2)}% from current
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">52W Low</CardTitle>
          <ArrowDown className="h-4 w-4 text-finance-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stock.low52Week.toFixed(2)}</div>
          <p className={cn(
            "text-xs flex items-center",
            (stock.currentPrice / stock.low52Week) < 1.1 
              ? "text-finance-red" 
              : "text-muted-foreground"
          )}>
            {(((stock.currentPrice - stock.low52Week) / stock.low52Week) * 100).toFixed(2)}% from current
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockStats;
