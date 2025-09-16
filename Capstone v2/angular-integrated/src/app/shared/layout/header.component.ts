import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <div class="page-title">{{ pageTitle }}</div>
      
      <div class="header-actions">
        <div class="notification-bell" (click)="toggleNotifications()">
          <i class="fas fa-bell"></i>
          <span *ngIf="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </div>
        
        <div class="user-info">
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notification Dropdown -->
    <div *ngIf="showNotifications" class="notification-dropdown">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button (click)="markAllAsRead()" class="mark-all-read">Mark all as read</button>
      </div>
      <div class="notification-list">
        <div *ngFor="let notification of notifications" 
             class="notification-item" 
             [class.unread]="!notification.isRead">
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.createdAt | date:'short' }}</div>
          </div>
        </div>
        <div *ngIf="notifications.length === 0" class="no-notifications">
          No notifications
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      height: 80px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: relative;
    }
    
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .notification-bell {
      position: relative;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
    }
    
    .notification-bell:hover {
      background-color: #f3f4f6;
    }
    
    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #dc2626;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-details {
      text-align: right;
    }
    
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
    }
    
    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      background: #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
    }
    
    .notification-dropdown {
      position: absolute;
      top: 100%;
      right: 2rem;
      width: 320px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      z-index: 1000;
    }
    
    .notification-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .notification-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }
    
    .mark-all-read {
      background: none;
      border: none;
      color: #2563eb;
      font-size: 0.75rem;
      cursor: pointer;
    }
    
    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .notification-item {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .notification-item.unread {
      background-color: #eff6ff;
    }
    
    .notification-title {
      font-weight: 500;
      color: #111827;
      font-size: 0.875rem;
    }
    
    .notification-message {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    
    .notification-time {
      color: #9ca3af;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
    
    .no-notifications {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';
  userName = '';
  userRole = '';
  showNotifications = false;
  unreadCount = 0;
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = (user as any).name || user.email;
      this.userRole = user.role;
    }
    
    this.loadNotifications();
  }

  private async loadNotifications() {
    try {
      const notifications = await this.notificationService.getMyNotifications().toPromise();
      this.notifications = notifications || [];
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.unreadCount = 0;
    // Call API to mark as read
  }
}