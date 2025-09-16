export interface NotificationRequest {
  recipientId: number;
  title: string;
  message: string;
  type: string;
}

export interface NotificationResponse {
  notificationId: number;
  recipientId: number;
  recipientName: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}