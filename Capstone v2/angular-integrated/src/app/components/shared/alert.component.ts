import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="alert alert-dismissible fade show"
      [class.alert-success]="alert.type === 'success'"
      [class.alert-danger]="alert.type === 'error'"
      [class.alert-warning]="alert.type === 'warning'"
      [class.alert-info]="alert.type === 'info'"
      *ngIf="alert"
    >
      <div class="d-flex align-items-center">
        <i [class]="getIcon()" class="me-2"></i>
        <div class="flex-grow-1">
          <h6 class="alert-heading mb-1" *ngIf="alert.title">{{ alert.title }}</h6>
          <div>{{ alert.message }}</div>
        </div>
        <button 
          type="button" 
          class="btn-close" 
          *ngIf="alert.dismissible !== false"
          (click)="dismiss()"
        ></button>
      </div>
    </div>
  `,
  styles: [`
    .alert {
      border-radius: 10px;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .alert-heading {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
  `]
})
export class AlertComponent {
  @Input() alert: Alert | null = null;
  @Output() dismissed = new EventEmitter<void>();

  getIcon(): string {
    switch (this.alert?.type) {
      case 'success': return 'feather icon-check-circle';
      case 'error': return 'feather icon-x-circle';
      case 'warning': return 'feather icon-alert-triangle';
      case 'info': return 'feather icon-info';
      default: return 'feather icon-info';
    }
  }

  dismiss(): void {
    this.alert = null;
    this.dismissed.emit();
  }
}