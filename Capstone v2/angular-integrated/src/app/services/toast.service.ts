import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  success(title: string, message: string, duration = 4000) {
    this.addToast({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration = 5000) {
    this.addToast({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration = 4000) {
    this.addToast({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration = 4000) {
    this.addToast({ type: 'info', title, message, duration });
  }

  private addToast(toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
      ...toast,
      id: this.generateId()
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}