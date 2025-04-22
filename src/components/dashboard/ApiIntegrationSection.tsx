
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApiIntegrationSection = () => {
  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>API Integration</CardTitle>
        <CardDescription>
          Connect to real stock data and ML predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Data Sources</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This demo is using mock data. Connect to these APIs for real data:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>yFinance API for real-time stock data</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>Python Flask backend for ML predictions</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>WebSockets for live price updates</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <p className="text-sm text-muted-foreground">
          Set up your Flask backend with scikit-learn or TensorFlow for ML-based predictions
        </p>
        <div className="flex gap-2">
          <Button variant="outline">API Documentation</Button>
          <Button>Connect API</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiIntegrationSection;
