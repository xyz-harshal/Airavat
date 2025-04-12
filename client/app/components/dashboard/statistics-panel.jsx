import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  Activity,
  Users,
  Zap,
  Clock, 
  FileBarChart
} from "lucide-react";

const conditions = [
  { name: "Epilepsy", icon: Zap, color: "text-red-500", bgColor: "bg-red-500/10", percentage: 12 },
  { name: "Cog. Stress", icon: Brain, color: "text-amber-500", bgColor: "bg-amber-500/10", percentage: 28 },
  { name: "Depression", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-500/10", percentage: 18 },
  { name: "Normal", icon: FileBarChart, color: "text-green-500", bgColor: "bg-green-500/10", percentage: 42 },
];

export default function StatisticsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      {/* Quick stats cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">EEG Analysis Accuracy</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.2%</div>
          <p className="text-xs text-muted-foreground">+2.5% improvement from baseline</p>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '94%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">Detection Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">New potential conditions detected</p>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span>High Priority: 2</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>Medium Priority: 5</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service usage stats */}
      <Card className="md:col-span-2">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Condition Distribution</CardTitle>
          <p className="text-xs text-muted-foreground">Across all analyzed EEG data</p>
        </CardHeader>
        <CardContent className="py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditions.map((condition) => (
              <div key={condition.name} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md ${condition.bgColor} flex items-center justify-center`}>
                    <condition.icon className={`h-3 w-3 ${condition.color}`} />
                  </div>
                  <span className="text-xs font-medium">{condition.name}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${
                      condition.name === "Normal" ? "from-green-500 to-green-600" :
                      condition.name === "Epilepsy" ? "from-red-500 to-red-600" :
                      condition.name === "Cog. Stress" ? "from-amber-500 to-amber-600" :
                      "from-blue-500 to-blue-600"
                    }`} 
                    style={{ width: `${condition.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold">{condition.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.2 min</div>
          <p className="text-xs text-muted-foreground">For complete EEG analysis</p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-sm" style={{ 
                height: `${15 + Math.floor(Math.random() * 25)}px`,
                background: i === 3 ? 'var(--primary)' : 'var(--muted)'
              }}></div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-sm font-medium">Patient Demographics</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs">Age Groups</span>
            <span className="text-xs text-muted-foreground">Patients</span>
          </div>
          <div className="space-y-1">
            {[
              { group: "0-18", value: 15, color: "bg-blue-500" },
              { group: "19-30", value: 24, color: "bg-green-500" },
              { group: "31-50", value: 42, color: "bg-amber-500" },
              { group: "51+", value: 19, color: "bg-red-500" }
            ].map((item) => (
              <div key={item.group} className="flex items-center gap-2">
                <div className="text-xs w-12">{item.group}</div>
                <div className="h-2 rounded-full bg-muted flex-1 overflow-hidden">
                  <div className={item.color} style={{ width: `${item.value}%`, height: "100%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground w-6 text-right">{item.value}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
