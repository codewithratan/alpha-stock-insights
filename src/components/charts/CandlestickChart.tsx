
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandlestickData, PredictionData, StockData } from '@/lib/stock-data';
import { ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface CandlestickChartProps {
  stock: StockData;
  candlestickData: CandlestickData[];
  predictions: PredictionData[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ stock, candlestickData, predictions }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const isPositive = stock.change >= 0;
  
  useEffect(() => {
    // This is where we would normally initialize a chart library like ApexCharts, ECharts, or Chart.js
    // For now, we'll use a placeholder to simulate the chart
    if (chartRef.current) {
      const chartElement = chartRef.current;
      chartElement.innerHTML = '';
      
      // Placeholder implementation - this would be replaced with an actual chart library
      const svgHeight = 300;
      const svgWidth = chartElement.clientWidth;
      
      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', `${svgHeight}px`);
      svg.style.overflow = 'visible';
      
      // Find min and max prices for scaling
      const allPrices = candlestickData.flatMap(d => [d.high, d.low]);
      const minPrice = Math.min(...allPrices) * 0.995;
      const maxPrice = Math.max(...allPrices) * 1.005;
      const priceRange = maxPrice - minPrice;
      
      // Scale for Y axis (price)
      const scaleY = (price: number) => svgHeight - ((price - minPrice) / priceRange * svgHeight);
      
      // Scale for X axis (time)
      const timeRange = candlestickData[candlestickData.length - 1].timestamp - candlestickData[0].timestamp;
      const scaleX = (time: number) => ((time - candlestickData[0].timestamp) / timeRange) * svgWidth;
      
      // Draw candlesticks
      candlestickData.forEach((data, i) => {
        const candleWidth = Math.max(svgWidth / candlestickData.length - 2, 2);
        const x = scaleX(data.timestamp);
        
        // Draw the vertical line (high to low)
        const highY = scaleY(data.high);
        const lowY = scaleY(data.low);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${x}`);
        line.setAttribute('y1', `${highY}`);
        line.setAttribute('x2', `${x}`);
        line.setAttribute('y2', `${lowY}`);
        line.setAttribute('stroke', data.close >= data.open ? '#10B981' : '#EF4444');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
        
        // Draw the candle body
        const openY = scaleY(data.open);
        const closeY = scaleY(data.close);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', `${x - candleWidth / 2}`);
        rect.setAttribute('y', `${Math.min(closeY, openY)}`);
        rect.setAttribute('width', `${candleWidth}`);
        rect.setAttribute('height', `${bodyHeight}`);
        rect.setAttribute('fill', data.close >= data.open ? '#10B981' : '#EF4444');
        svg.appendChild(rect);
      });
      
      // Add prediction line
      if (predictions.length > 0) {
        // Get the last data point from candlestick data
        const lastCandleData = candlestickData[candlestickData.length - 1];
        const startX = scaleX(lastCandleData.timestamp);
        const startY = scaleY(lastCandleData.close);
        
        // Create prediction path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let pathD = `M ${startX},${startY} `;
        
        predictions.forEach((pred) => {
          const x = scaleX(pred.timestamp);
          const y = scaleY(pred.predictedPrice);
          pathD += `L ${x},${y} `;
        });
        
        path.setAttribute('d', pathD);
        path.setAttribute('stroke', '#8B5CF6');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(path);
        
        // Add confidence areas above and below the prediction line
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let areaPathD = `M ${startX},${startY} `;
        
        predictions.forEach((pred) => {
          const x = scaleX(pred.timestamp);
          const y = scaleY(pred.predictedPrice);
          const confidenceHeight = 10 * pred.confidence; // Scaled for visibility
          areaPathD += `L ${x},${y - confidenceHeight} `;
        });
        
        // Back through the points in reverse order
        for (let i = predictions.length - 1; i >= 0; i--) {
          const pred = predictions[i];
          const x = scaleX(pred.timestamp);
          const y = scaleY(pred.predictedPrice);
          const confidenceHeight = 10 * pred.confidence; // Scaled for visibility
          areaPathD += `L ${x},${y + confidenceHeight} `;
        }
        
        areaPathD += `L ${startX},${startY} Z`;
        areaPath.setAttribute('d', areaPathD);
        areaPath.setAttribute('fill', '#8B5CF6');
        areaPath.setAttribute('fill-opacity', '0.1');
        svg.appendChild(areaPath);
      }
      
      // Add y-axis with price labels
      const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxisLine.setAttribute('x1', '0');
      yAxisLine.setAttribute('y1', '0');
      yAxisLine.setAttribute('x2', '0');
      yAxisLine.setAttribute('y2', `${svgHeight}`);
      yAxisLine.setAttribute('stroke', '#6B7280');
      yAxisLine.setAttribute('stroke-width', '1');
      svg.appendChild(yAxisLine);
      
      // Price labels
      for (let i = 0; i <= 5; i++) {
        const price = minPrice + (priceRange / 5 * i);
        const y = scaleY(price);
        
        // Horizontal grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', '0');
        gridLine.setAttribute('y1', `${y}`);
        gridLine.setAttribute('x2', `${svgWidth}`);
        gridLine.setAttribute('y2', `${y}`);
        gridLine.setAttribute('stroke', '#6B7280');
        gridLine.setAttribute('stroke-width', '0.5');
        gridLine.setAttribute('stroke-opacity', '0.2');
        gridLine.setAttribute('stroke-dasharray', '4,4');
        svg.appendChild(gridLine);
        
        // Price label text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '-5');
        text.setAttribute('y', `${y}`);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#9CA3AF');
        text.setAttribute('font-size', '10px');
        text.textContent = price.toFixed(2);
        svg.appendChild(text);
      }
      
      // Append the SVG to the container
      chartElement.appendChild(svg);
    }
  }, [candlestickData, predictions, stock]);
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle>{stock.symbol}</CardTitle>
            <span className="text-muted-foreground text-sm">{stock.companyName}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-bold">${stock.currentPrice.toFixed(2)}</span>
            <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-finance-green' : 'text-finance-red'}`}>
              {isPositive ? <ArrowUp className="h-4 w-4 mr-0.5" /> : <ArrowDown className="h-4 w-4 mr-0.5" />}
              {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
            </span>
            {predictions.length > 0 && (
              <Badge variant={predictions[0].direction === 'up' ? 'outline' : 'destructive'} className="ml-2">
                ML Prediction: {predictions[0].direction === 'up' ? 'Bullish' : predictions[0].direction === 'down' ? 'Bearish' : 'Neutral'}
                {` (${(predictions[0].confidence * 100).toFixed(0)}% confidence)`}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="1D">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1D</SelectItem>
              <SelectItem value="1W">1W</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="5Y">5Y</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="candlestick">
          <TabsList className="mb-4">
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="prediction">ML Prediction</TabsTrigger>
          </TabsList>
          <TabsContent value="candlestick" className="h-[300px] w-full">
            <div className="h-full w-full" ref={chartRef} />
          </TabsContent>
          <TabsContent value="line" className="h-[300px] w-full">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">Line Chart View</span>
            </div>
          </TabsContent>
          <TabsContent value="prediction" className="h-[300px] w-full">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">ML Prediction View</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CandlestickChart;
