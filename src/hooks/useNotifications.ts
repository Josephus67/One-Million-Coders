import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Notification, NotificationResponse } from "@/types/notifications";

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      // API returns { notifications: [...], pagination: {...} }
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Create notification (for admin use)
  const createNotification = async (data: {
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    userId?: string;
  }) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      const newNotification = await response.json();
      
      // If it's for the current user, add to local state
      if (!data.userId || data.userId === session?.user?.id) {
        setNotifications(prev => [newNotification, ...prev]);
      }

      return newNotification;
    } catch (err) {
      console.error("Error creating notification:", err);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (!session?.user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, session?.user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  };
}