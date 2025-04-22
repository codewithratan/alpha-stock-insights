
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CandlestickChart from "@/components/charts/CandlestickChart";
import StockStats from "@/components/dashboard/StockStats";
import MLInsights from "@/components/dashboard/MLInsights";
import TopPerformers from "@/components/dashboard/TopPerformers";
import { generateMockCandlestickData, generateMockPredictions, popularStocks, StockData } from "@/lib/stock-data";
import ApiIntegrationSection from "@/components/dashboard/ApiIntegrationSection";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState(popularStocks[0]);
  const [candlestickData, setCandlestickData] = useState(generateMockCandlestickData(selectedStock.symbol));
  const [predictions, setPredictions] = useState(generateMockPredictions(candlestickData));
  
  // Update chart data when selected stock changes
  useEffect(() => {
    const newCandleData = generateMockCandlestickData(selectedStock.symbol);
    setCandlestickData(newCandleData);
    setPredictions(generateMockPredictions(newCandleData));
  }, [selectedStock]);

  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header onStockSelect={handleStockSelect} />
      <div className="flex-1 flex">
        <Sidebar className="w-64 hidden md:flex flex-col" onStockSelect={handleStockSelect} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            <CandlestickChart 
              stock={selectedStock} 
              candlestickData={candlestickData} 
              predictions={predictions} 
            />
            <StockStats stock={selectedStock} />
            <MLInsights stock={selectedStock} predictions={predictions} />
            <TopPerformers stocks={popularStocks} />
            <ApiIntegrationSection />
            <ApiIntegrationSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
