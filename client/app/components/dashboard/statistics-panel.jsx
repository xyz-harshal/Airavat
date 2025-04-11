import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Code
} from "lucide-react";

const services = [
  { name: "Chat", icon: MessageSquare, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { name: "Image", icon: ImageIcon, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { name: "Text", icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10" },
  { name: "Code", icon: Code, color: "text-amber-500", bgColor: "bg-amber-500/10" },
];

export default function StatisticsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      {/* Quick stats cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">API Usage Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12.5%</div>
          <p className="text-xs text-muted-foreground">Compared to last month</p>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '65%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">Service Health</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">98.2%</div>
              <p className="text-xs text-muted-foreground">Overall uptime</p>
            </div>
            <div className="grid grid-flow-col gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Today's API usage */}
      <Card className="col-span-2 ">
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">Today's API Usage</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center space-x-4 rounded-md border p-4">
              <div className={`p-2 rounded-md ${service.bgColor}`}>
                <service.icon className={`h-5 w-5 ${service.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(Math.random() * 100) + 10} calls
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
