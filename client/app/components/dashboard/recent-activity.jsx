import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Code,
} from "lucide-react";

// Mock data for recent activities
const recentActivities = [
  { 
    id: 1, 
    service: "Chat", 
    description: "AI Conversation - Customer Support", 
    timestamp: "10 minutes ago",
    status: "completed",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10"
  },
  { 
    id: 2, 
    service: "Image", 
    description: "Generated 3 product mockups", 
    timestamp: "1 hour ago",
    status: "completed",
    icon: ImageIcon,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10"
  },
  { 
    id: 3, 
    service: "Text", 
    description: "Generated blog post about AI trends", 
    timestamp: "3 hours ago",
    status: "completed",
    icon: FileText,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10"
  },
  { 
    id: 4, 
    service: "Code", 
    description: "Code refactoring for React component", 
    timestamp: "5 hours ago",
    status: "completed",
    icon: Code,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10"
  },
  { 
    id: 5, 
    service: "Chat", 
    description: "Legal document analysis", 
    timestamp: "Yesterday",
    status: "completed",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10"
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="sm:flex sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest AI service usage and interactions
          </CardDescription>
        </div>
        
        {/* Optional: Add a mobile-friendly view toggle or filter here */}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`${activity.iconBg} p-2 rounded-md mt-0.5 flex-shrink-0`}>
                  <IconComponent className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm font-medium leading-none">{activity.service}</p>
                    <Badge 
                      variant="outline" 
                      className={`
                        w-fit
                        ${activity.status === 'completed' 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                        }
                      `}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
