
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { popularStocks, StockData } from "@/lib/stock-data";
import { cn } from "@/lib/utils";

interface StockSearchInputProps {
  onStockSelect: (stock: StockData) => void;
}

export default function StockSearchInput({ onStockSelect }: StockSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = popularStocks.filter(
        stock => 
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
          stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredStocks([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleSelect = (stock: StockData) => {
    setSearchTerm(stock.symbol);
    setIsOpen(false);
    onStockSelect(stock);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search stocks..."
          className="w-full bg-background pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && filteredStocks.length > 0 && setIsOpen(true)}
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-full z-10 bg-card border rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {filteredStocks.map(stock => (
              <li 
                key={stock.symbol} 
                className="px-3 py-2 hover:bg-accent cursor-pointer flex justify-between items-center"
                onClick={() => handleSelect(stock)}
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.companyName}</div>
                </div>
                <div className={cn(
                  stock.change >= 0 ? "text-finance-green" : "text-finance-red",
                  "font-medium"
                )}>
                  ${stock.currentPrice.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
