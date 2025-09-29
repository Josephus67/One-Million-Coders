import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Notification, NotificationResponse } from "@/types/notifications";

export function useNotifications() {
  const { user, isSignedIn } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn || !user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/notifications");
      
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          setError("Authentication required");
          return;
        }
        
        // Try to get error message from response
        let errorMessage = "Failed to fetch notifications";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Response wasn't JSON, use default error
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Handle case where API returns error with 200 status
      if (data.error) {
        console.warn("API returned error with 200 status:", data.error);
        setNotifications([]);
        setError(null); // Don't show error to user for graceful degradation
        return;
      }
      
      // API returns { notifications: [...], pagination: {...} }
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
      
      // Set empty notifications array to prevent app crashes
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isSignedIn]);

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
      if (!data.userId || data.userId === user?.id) {
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
    if (!isSignedIn || !user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, user?.id, isSignedIn]);

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