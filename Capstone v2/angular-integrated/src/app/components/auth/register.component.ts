import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-logo">
            <span class="material-icons">account_balance</span>
            <h1>Payroll360</h1>
          </div>
          <p class="auth-subtitle">Create your account</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName"
                class="form-control"
                formControlName="firstName"
                placeholder="Enter your first name"
              >
              <div class="form-error" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                <span *ngIf="registerForm.get('firstName')?.errors?.['required']">First name is required</span>
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                class="form-control"
                formControlName="lastName"
                placeholder="Enter your last name"
              >
              <div class="form-error" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                <span *ngIf="registerForm.get('lastName')?.errors?.['required']">Last name is required</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="Enter your email address"
              autocomplete="email"
            >
            <div class="form-error" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              class="form-control"
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="new-password"
            >
            <div class="form-error" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              class="form-control"
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              autocomplete="new-password"
            >
            <div class="form-error" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="registerForm.errors?.['passwordMismatch']">Passwords do not match</span>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select 
              id="role"
              class="form-control"
              formControlName="role"
            >
              <option value="">Select your role</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Finance">Finance Admin</option>
            </select>
            <div class="form-error" *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
              <span *ngIf="registerForm.get('role')?.errors?.['required']">Please select a role</span>
            </div>
          </div>

          <div class="form-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? 
            <a routerLink="/login" class="auth-link">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
      padding: var(--spacing-lg);
    }
    
    .auth-card {
      background: var(--surface);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-4);
      padding: var(--spacing-3xl);
      width: 100%;
      max-width: 480px;
      backdrop-filter: blur(10px);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
    
    .brand-logo .material-icons {
      font-size: 32px;
      color: var(--primary-500);
    }
    
    .brand-logo h1 {
      margin: 0;
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .auth-subtitle {
      color: var(--on-surface-variant);
      font-size: var(--font-size-base);
      margin: 0;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    
    .form-group label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }
    
    .form-control {
      padding: var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all 0.2s ease;
      background-color: var(--surface);
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }
    
    .form-error {
      color: var(--error-500);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-xs);
    }
    
    .btn {
      padding: var(--spacing-md) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      min-height: 48px;
      width: 100%;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      box-shadow: var(--shadow-2);
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      box-shadow: var(--shadow-3);
      transform: translateY(-1px);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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
    
    @media (max-width: 480px) {
      .auth-container {
        padding: var(--spacing-md);
      }
      
      .auth-card {
        padding: var(--spacing-2xl);
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword; // Remove confirmPassword before sending

      this.authService.register(formData).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Account created successfully! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}