
import React, { useState, useEffect } from "react";
import { BellRing, Check, X, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Notification } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/services/notificationService";

interface NotificationCenterProps {
  initialNotifications?: Notification[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  initialNotifications = []
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [emailEnabled, setEmailEnabled] = useState(true);
  
  // Poll for new notifications (in a real app, this would use Supabase realtime)
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(getNotifications());
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
      setNotifications(getNotifications());
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };
  
  const handleDismiss = (id: string) => {
    // For now, just mark as read
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px]" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-8"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="p-2 border-b">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
            <Label htmlFor="email-notifications" className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-1" /> Email notifications
            </Label>
          </div>
        </div>
        
        {notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b last:border-b-0 ${notification.read ? 'bg-background' : 'bg-secondary/30'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-2 mt-1.5">{getNotificationIcon(notification.type)}</div>
                      <div>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
