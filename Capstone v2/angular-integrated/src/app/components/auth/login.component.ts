import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="login-bg">
          <img src="assets/images/login.jpg" alt="Login Background" />
        </div>
      </div>
      
      <div class="login-right">
        <div class="auth-card">
          <div class="auth-header">
            <div class="brand-logo">
              <span class="material-icons">account_balance</span>
              <h1>Payroll360</h1>
            </div>
            <p class="auth-subtitle">Sign in to your account</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <span class="material-icons input-icon">email</span>
                <input 
                  type="email" 
                  id="email"
                  class="form-control"
                  formControlName="email"
                  placeholder="Enter your email address"
                  autocomplete="email"
                >
              </div>
              <div class="form-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <span class="material-icons input-icon">lock</span>
                <input 
                  type="password" 
                  id="password"
                  class="form-control"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                >
              </div>
              <div class="form-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              </div>
            </div>

            <div class="form-error" *ngIf="errorMessage">
              <span class="material-icons">error</span>
              {{ errorMessage }}
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-lg"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span class="spinner" *ngIf="isLoading"></span>
              <span class="material-icons" *ngIf="!isLoading">login</span>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>


        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      background: #ffffff;
    }
    
    .login-left {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    
    .login-bg {
      position: relative;
      height: 100%;
    }
    
    .login-bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: #ffffff;
    }
    
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 3rem;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .brand-logo .material-icons {
      font-size: 2.5rem;
      color: #3b82f6;
    }
    
    .brand-logo h1 {
      margin: 0;
      font-size: 2.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .auth-subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
      font-weight: 400;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.25rem;
    }
    
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      left: 1rem;
      color: #6b7280;
      z-index: 1;
      font-size: 1.25rem;
    }
    
    .form-control {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: white;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    

    
    .form-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-error .material-icons {
      font-size: 1rem;
    }
    
    .btn {
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 52px;
      width: 100%;
      margin-top: 1rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: var(--spacing-lg);
    }
    
    .auth-footer p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin: 0;
    }
    
    .auth-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      transition: color 0.2s ease;
    }
    
    .auth-link:hover {
      color: var(--primary-700);
      text-decoration: underline;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      
      .login-left {
        height: 40vh;
      }
      
      .welcome-content h2 {
        font-size: 2rem;
      }
      
      .features {
        display: none;
      }
      
      .login-right {
        padding: 1rem;
      }
      

    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }



  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success('Login Successful', 'Welcome to Payroll360!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          this.toastService.error('Login Failed', this.errorMessage);
        }
      });
    }
  }
}