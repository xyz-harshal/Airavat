"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator"; // Use our custom separator

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

export default function NotificationsModal({ triggerClassName }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={`relative rounded-full ${triggerClassName || ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px] md:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="px-0 sm:px-0">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 ml-1">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex gap-1 sm:gap-2 self-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={notifications.every(n => n.read)}
                className="h-7 text-xs sm:text-sm sm:h-8 px-2"
              >
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                <span className="hidden xs:inline">Mark all read</span>
                <span className="xs:hidden">Read all</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive h-7 text-xs sm:text-sm sm:h-8 px-2"
                onClick={handleDeleteAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                <span className="hidden xs:inline">Clear all</span>
                <span className="xs:hidden">Clear</span>
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Your recent notifications and activity updates.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-1.5 px-0 sm:py-2">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs sm:text-sm py-1.5 px-0 sm:py-2">Unread</TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm py-1.5 px-0 sm:py-2">System</TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm py-1.5 px-0 sm:py-2">Activity</TabsTrigger>
          </TabsList>
          
          <div className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto mt-2">
            <TabsContent value="all" className="space-y-0 mt-0 px-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any notifications at the moment.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    <div 
                      className={`py-3 px-2 flex gap-2 sm:gap-4 hover:bg-muted/50 rounded-md transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-md self-start flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <h4 className="font-medium text-sm mr-1">{notification.title}</h4>
                          <div className="flex items-center gap-1 self-start">
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 break-words">{notification.message}</p>
                        
                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 px-2 sm:h-8 sm:px-3"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                              <span className="text-xs">Read</span>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 px-2 sm:h-8 sm:px-3 text-muted-foreground"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="h-[1px] w-full bg-border my-1"></div>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="mt-0 px-1">
              {notifications.filter(n => !n.read).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                  <Check className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have read all your notifications.
                  </p>
                </div>
              ) : (
                notifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="relative">
                      <div className="py-4 px-1 flex gap-4 hover:bg-muted/50 rounded-md transition-colors bg-muted/20">
                        <div className={`p-2 rounded-md self-start ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          
                          <div className="mt-2 flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Mark as read</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-muted-foreground"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-border my-1"></div>
                    </div>
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="system" className="mt-0 px-1">
              {notifications.filter(n => n.type === 'system' || n.type === 'alert').length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No system notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no system notifications at the moment.
                  </p>
                </div>
              ) : (
                notifications
                  .filter(n => n.type === 'system' || n.type === 'alert')
                  .map((notification) => (
                    <div key={notification.id} className="relative">
                      <div className={`py-4 px-1 flex gap-4 hover:bg-muted/50 rounded-md transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}>
                        <div className={`p-2 rounded-md self-start ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          
                          <div className="mt-2 flex justify-end gap-2">
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Mark as read</span>
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-muted-foreground"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-border my-1"></div>
                    </div>
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="activities" className="mt-0 px-1">
              {notifications.filter(n => ['chat', 'image', 'text', 'code'].includes(n.type)).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                  <ActivityIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No activity notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any activity notifications at the moment.
                  </p>
                </div>
              ) : (
                notifications
                  .filter(n => ['chat', 'image', 'text', 'code'].includes(n.type))
                  .map((notification) => (
                    <div key={notification.id} className="relative">
                      <div className={`py-4 px-1 flex gap-4 hover:bg-muted/50 rounded-md transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}>
                        <div className={`p-2 rounded-md self-start ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          
                          <div className="mt-2 flex justify-end gap-2">
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Mark as read</span>
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-muted-foreground"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-border my-1"></div>
                    </div>
                  ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for the empty activities tab
function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
