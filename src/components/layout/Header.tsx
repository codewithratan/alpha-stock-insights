
import { Button } from "@/components/ui/button";
import { StockData } from "@/lib/stock-data";
import StockSearchInput from "../stocks/StockSearchInput";

interface HeaderProps {
  onStockSelect?: (stock: StockData) => void;
}

export default function Header({ onStockSelect }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary mr-4">
          <span className="flex items-center">
            <span className="text-2xl">α</span>
            <span className="ml-1">Alpha</span>
          </span>
          <span className="text-muted-foreground">Insights</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-64">
            {onStockSelect && <StockSearchInput onStockSelect={onStockSelect} />}
          </div>
          <Button variant="outline" className="hidden md:block">Login</Button>
          <Button className="hidden md:block">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
