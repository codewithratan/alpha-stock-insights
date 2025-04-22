
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CandlestickData, PredictionData, StockData } from "@/lib/stock-data";
import { TrendingDown, TrendingUp, ChartLine } from "lucide-react";

interface MLInsightsProps {
  stock: StockData;
  predictions: PredictionData[];
}

const MLInsights: React.FC<MLInsightsProps> = ({ stock, predictions }) => {
  // Take the average prediction direction
  const predictionCount = {up: 0, neutral: 0, down: 0};
  let averageConfidence = 0;
  
  predictions.forEach(pred => {
    predictionCount[pred.direction]++;
    averageConfidence += pred.confidence;
  });
  
  averageConfidence = averageConfidence / predictions.length;
  
  const overallDirection = 
    predictionCount.up > predictionCount.down ? 'up' : 
    predictionCount.down > predictionCount.up ? 'down' : 'neutral';
  
  const getSentiment = () => {
    if (overallDirection === 'up') {
      return averageConfidence > 0.7 ? 'Strongly Bullish' : 'Moderately Bullish';
    } else if (overallDirection === 'down') {
      return averageConfidence > 0.7 ? 'Strongly Bearish' : 'Moderately Bearish';
    }
    return 'Neutral';
  };
  
  const getRecommendation = () => {
    if (overallDirection === 'up' && averageConfidence > 0.7) {
      return 'Consider buying or holding';
    } else if (overallDirection === 'up') {
      return 'Potential buying opportunity';
    } else if (overallDirection === 'down' && averageConfidence > 0.7) {
      return 'Consider reducing position';
    } else if (overallDirection === 'down') {
      return 'Caution advised';
    }
    return 'Monitor closely';
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl">ML Analysis</CardTitle>
          <CardDescription>
            AI-powered prediction based on historical data patterns
          </CardDescription>
        </div>
        <div className="ml-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <ChartLine className="w-6 h-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Sentiment</div>
            <div className="flex items-center">
              {overallDirection === 'up' ? (
                <TrendingUp className="mr-2 text-finance-green" />
              ) : overallDirection === 'down' ? (
                <TrendingDown className="mr-2 text-finance-red" />
              ) : (
                <ChartLine className="mr-2 text-muted-foreground" />
              )}
              <span className={
                overallDirection === 'up' ? 'text-finance-green' : 
                overallDirection === 'down' ? 'text-finance-red' : ''
              }>{getSentiment()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Confidence</div>
            <div className="flex items-center">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    averageConfidence > 0.7 ? 'bg-finance-green' :
                    averageConfidence > 0.4 ? 'bg-finance-yellow' :
                    'bg-finance-red'
                  }`}
                  style={{ width: `${averageConfidence * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm">{Math.round(averageConfidence * 100)}%</span>
            </div>
          </div>
        </div>
      
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">Price Forecast (7 Days)</div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Current</div>
              <div className="font-bold">${stock.currentPrice.toFixed(2)}</div>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4 relative">
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">→</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Predicted</div>
              <div className={`font-bold ${
                predictions[predictions.length - 1].predictedPrice > stock.currentPrice ? 
                  'text-finance-green' : 'text-finance-red'
              }`}>
                ${predictions[predictions.length - 1].predictedPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium">Key Factors</div>
          <ul className="mt-2 text-sm">
            <li className="flex items-center py-1">
              <div className="w-2 h-2 rounded-full bg-finance-blue mr-2"></div>
              Recent trading volume {stock.volume > 20000000 ? 'above' : 'below'} average
            </li>
            <li className="flex items-center py-1">
              <div className="w-2 h-2 rounded-full bg-finance-blue mr-2"></div>
              Price volatility {stock.changePercent > 1 ? 'higher' : 'lower'} than market average
            </li>
            <li className="flex items-center py-1">
              <div className="w-2 h-2 rounded-full bg-finance-blue mr-2"></div>
              Market sentiment: {predictionCount.up > predictionCount.down ? 'Positive' : 'Cautious'}
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          <strong>Recommendation:</strong> {getRecommendation()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MLInsights;
