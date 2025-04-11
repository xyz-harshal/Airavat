"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/dashboard/layout";
import { 
  Bell, 
  Check, 
  Trash2, 
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Code,
  AlertCircle,
  Info,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample notifications - in a real app, these would come from an API
const mockNotifications = [
  {
    id: 1,
    title: "Chat session completed",
    message: "Your conversation with the AI assistant has been saved.",
    time: "Just now",
    read: false,
    type: "chat"
  },
  {
    id: 2,
    title: "Images generated",
    message: "Your requested images are ready to download.",
    time: "5 minutes ago",
    read: false,
    type: "image"
  },
  {
    id: 3,
    title: "System maintenance",
    message: "Scheduled maintenance in 24 hours. Service might be temporarily unavailable.",
    time: "1 hour ago",
    read: true,
    type: "system"
  },
  {
    id: 4,
    title: "Text generation complete",
    message: "Your article has been generated and is available in your documents.",
    time: "2 hours ago",
    read: true,
    type: "text"
  },
  {
    id: 5,
    title: "Code snippet saved",
    message: "Your code has been saved to your snippets collection.",
    time: "Yesterday",
    read: true,
    type: "code"
  },
  {
    id: 6,
    title: "Security alert",
    message: "New login detected from an unknown device. Please verify if it was you.",
    time: "2 days ago",
    read: false,
    type: "alert"
  },
  {
    id: 7,
    title: "Billing update",
    message: "Your monthly invoice is ready. Your subscription will renew on Nov 15.",
    time: "3 days ago",
    read: true,
    type: "system"
  },
  {
    id: 8,
    title: "New feature available",
    message: "We've added new AI models to the Text Generation tool. Try them out now!",
    time: "5 days ago",
    read: true,
    type: "system"
  }
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "chat": return <MessageSquare className="h-5 w-5" />;
    case "image": return <ImageIcon className="h-5 w-5" />;
    case "text": return <FileText className="h-5 w-5" />;
    case "code": return <Code className="h-5 w-5" />;
    case "system": return <Info className="h-5 w-5" />;
    case "alert": return <AlertCircle className="h-5 w-5" />;
    default: return <Bell className="h-5 w-5" />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "chat": return "bg-blue-500/10 text-blue-500";
    case "image": return "bg-purple-500/10 text-purple-500";
    case "text": return "bg-green-500/10 text-green-500";
    case "code": return "bg-amber-500/10 text-amber-500";
    case "system": return "bg-gray-500/10 text-gray-500";
    case "alert": return "bg-red-500/10 text-red-500";
    default: return "bg-primary/10 text-primary";
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // In a real app, you would fetch notifications from API here
    setLoading(false);
  }, [router]);
  
  // Handle marking single notification as read
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Handle deleting a notification
  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Handle deleting all notifications
  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage your notifications and alerts
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={!unreadCount}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <Card>
          <Tabs defaultValue="all">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    defaultValue="newest"
                    onValueChange={(value) => console.log(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="unread">Unread first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="all">
                <NotificationsList 
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
              
              <TabsContent value="unread">
                <NotificationsList 
                  notifications={notifications.filter(n => !n.read)}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
              
              <TabsContent value="system">
                <NotificationsList 
                  notifications={notifications.filter(n => n.type === "system" || n.type === "alert")}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
              
              <TabsContent value="activities">
                <NotificationsList 
                  notifications={notifications.filter(n => ["chat", "image", "text", "code"].includes(n.type))}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function NotificationsList({ notifications, onMarkAsRead, onDelete }) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notifications</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          You don't have any notifications in this category at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="relative">
          <div 
            className={`p-4 flex gap-4 hover:bg-muted/50 rounded-md transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
          >
            <div className={`p-2 rounded-md h-min ${getNotificationColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                <div>
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end gap-2">
                {!notification.read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="mr-2 h-3.5 w-3.5" />
                    Mark as read
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
          {/* Simple border separator instead of using the Separator component */}
          <div className="h-[1px] w-full bg-border mt-4"></div>
        </div>
      ))}
    </div>
  );
}
