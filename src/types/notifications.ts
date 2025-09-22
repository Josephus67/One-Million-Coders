/**
 * Shared notification types used across the application
 */

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: string;
  actionUrl?: string;
  metadata?: any;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationCreateData {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  actionUrl?: string;
  metadata?: any;
}

export interface NotificationUpdateData {
  isRead?: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  page?: number;
}