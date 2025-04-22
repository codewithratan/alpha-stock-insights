
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockData } from "@/lib/stock-data";
import { ArrowDown, ArrowUp } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

interface TopPerformersProps {
  stocks: StockData[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ stocks }) => {
  // Sort stocks by percent change
  const sortedStocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedStocks.slice(0, 5);
  const topLosers = [...sortedStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Market Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium flex items-center mb-2">
              <ArrowUp className="h-5 w-5 mr-1 text-finance-green" /> Top Gainers
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topGainers.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>${stock.currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-finance-green">
                        +{stock.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(stock.volume)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium flex items-center mb-2">
              <ArrowDown className="h-5 w-5 mr-1 text-finance-red" /> Top Losers
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topLosers.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>${stock.currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-finance-red">
                        {stock.changePercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(stock.volume)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
