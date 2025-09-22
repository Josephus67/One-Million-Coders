"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Check,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { Notification, NotificationResponse } from "@/types/notifications";

interface NotificationsPageProps {
  onBack?: () => void;
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?unreadOnly=${filter === "unread"}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?action=markRead&id=${notificationId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications?action=markAllRead", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "ERROR":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeVariant = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "default" as const;
      case "WARNING":
        return "secondary" as const;
      case "ERROR":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === "all" || (filter === "unread" && !notification.isRead)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with your course activities
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  Unread ({unreadCount})
                </Button>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark All Read</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filter === "all" ? "All Notifications" : "Unread Notifications"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === "unread" 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."
                  }
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`relative p-4 rounded-lg border transition-colors ${
                          notification.isRead 
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            : "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className={`text-sm font-medium ${
                                    notification.isRead 
                                      ? "text-gray-700 dark:text-gray-300"
                                      : "text-gray-900 dark:text-white"
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  <Badge 
                                    variant={getNotificationBadgeVariant(notification.type)}
                                    className="text-xs"
                                  >
                                    {notification.type.toLowerCase()}
                                  </Badge>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                
                                <p className={`text-sm ${
                                  notification.isRead 
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}>
                                  {notification.message}
                                </p>
                                
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-4">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 h-8 w-8"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < filteredNotifications.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}