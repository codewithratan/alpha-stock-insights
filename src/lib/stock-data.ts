
// Mock stock data for initial development
// This would be replaced with actual API calls to yFinance or a Flask backend

export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  high52Week: number;
  low52Week: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface PredictionData {
  timestamp: number;
  predictedPrice: number;
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
}

// Mock data for popular tech stocks
export const popularStocks: StockData[] = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 173.75,
    change: 2.42,
    changePercent: 1.41,
    marketCap: 2721000000000,
    volume: 58869600,
    high52Week: 182.94,
    low52Week: 124.17
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 408.39,
    change: 2.70,
    changePercent: 0.67,
    marketCap: 3036000000000,
    volume: 18188500,
    high52Week: 420.82,
    low52Week: 309.00
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    currentPrice: 177.85,
    change: -0.33,
    changePercent: -0.18,
    marketCap: 2217000000000,
    volume: 16064600,
    high52Week: 181.33,
    low52Week: 120.21
  },
  {
    symbol: "AMZN",
    companyName: "Amazon.com Inc.",
    currentPrice: 186.46,
    change: 1.07,
    changePercent: 0.58,
    marketCap: 1939000000000,
    volume: 24019000,
    high52Week: 189.77,
    low52Week: 118.35
  },
  {
    symbol: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 178.02,
    change: -1.46,
    changePercent: -0.81,
    marketCap: 567100000000,
    volume: 81668500,
    high52Week: 278.98,
    low52Week: 138.80
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 881.86,
    change: 10.48,
    changePercent: 1.20,
    marketCap: 2170000000000,
    volume: 29742700,
    high52Week: 973.85,
    low52Week: 443.53
  },
  {
    symbol: "META",
    companyName: "Meta Platforms Inc.",
    currentPrice: 511.41,
    change: 4.94,
    changePercent: 0.97,
    marketCap: 1303000000000,
    volume: 11802700,
    high52Week: 531.49,
    low52Week: 313.92
  },
  {
    symbol: "AMD",
    companyName: "Advanced Micro Devices Inc.",
    currentPrice: 170.69,
    change: 3.23,
    changePercent: 1.93,
    marketCap: 275700000000,
    volume: 42594400,
    high52Week: 227.30,
    low52Week: 93.12
  }
];

// Generate mock candlestick data for a symbol
export const generateMockCandlestickData = (symbol: string, days: number = 90): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const today = new Date();
  let basePrice: number = 0;
  
  // Set base price based on symbol
  switch(symbol) {
    case "AAPL": basePrice = 170; break;
    case "MSFT": basePrice = 400; break;
    case "GOOGL": basePrice = 175; break;
    case "AMZN": basePrice = 185; break;
    case "TSLA": basePrice = 180; break;
    case "NVDA": basePrice = 875; break;
    case "META": basePrice = 505; break;
    case "AMD": basePrice = 165; break;
    default: basePrice = 100;
  }
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    // Add some randomness to price
    const volatility = 0.02; // 2% volatility
    const changePercent = (Math.random() - 0.5) * volatility;
    const change = basePrice * changePercent;
    
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + (Math.random() * basePrice * 0.01);
    const low = Math.min(open, close) - (Math.random() * basePrice * 0.01);
    const volume = Math.floor(Math.random() * 10000000) + 5000000;
    
    data.push({
      timestamp: date.getTime(),
      open,
      high,
      close,
      low,
      volume
    });
    
    // Update base price for next day
    basePrice = close;
  }
  
  return data;
};

// Generate mock prediction data based on candlestick data
export const generateMockPredictions = (candlestickData: CandlestickData[], days: number = 7): PredictionData[] => {
  const predictions: PredictionData[] = [];
  
  if (candlestickData.length === 0) {
    return predictions;
  }
  
  const lastDay = candlestickData[candlestickData.length - 1];
  const lastPrice = lastDay.close;
  const lastTimestamp = lastDay.timestamp;
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 1; i <= days; i++) {
    const trend = Math.random() > 0.5 ? 1 : -1;
    const changePercent = (Math.random() * 0.03) * trend; // Up to 3% change
    const predictedPrice = lastPrice * (1 + (changePercent * i / 2));
    const confidence = 0.5 + (Math.random() * 0.4); // 50-90% confidence
    
    const direction = changePercent > 0.005 ? 'up' : 
                     changePercent < -0.005 ? 'down' : 'neutral';
    
    predictions.push({
      timestamp: lastTimestamp + (i * oneDayMs),
      predictedPrice,
      confidence,
      direction
    });
  }
  
  return predictions;
};
