import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';

@Component({
  selector: 'app-insurance-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Insurance Enrollment</h1>
        <p>Apply for insurance policies</p>
      </div>

      <div class="policies-grid">
        <div class="policy-card" *ngFor="let policy of availablePolicies">
          <div class="policy-header">
            <div class="policy-icon" [ngClass]="policy.type">
              <span class="material-icons">{{ policy.icon }}</span>
            </div>
            <h3>{{ policy.name }}</h3>
            <div class="policy-premium">₹{{ policy.premium | number:'1.0-0' }}/month</div>
          </div>
          
          <div class="policy-features">
            <div class="feature" *ngFor="let feature of policy.features">
              <span class="material-icons">check</span>
              <span>{{ feature }}</span>
            </div>
          </div>
          
          <div class="policy-coverage">
            <div class="coverage-label">Coverage Amount</div>
            <div class="coverage-amount">₹{{ policy.coverage | number:'1.0-0' }}</div>
          </div>
          
          <button class="btn btn-primary" (click)="enrollInPolicy(policy)" [disabled]="isLoading">
            {{ isLoading ? 'Processing...' : 'Enroll Now' }}
          </button>
        </div>
      </div>

      <div class="card" *ngIf="myEnrollments.length > 0">
        <div class="card-header">
          <h3 class="card-title">My Enrollments</h3>
        </div>
        <div class="card-body">
          <div class="enrollment-list">
            <div class="enrollment-item" *ngFor="let enrollment of myEnrollments">
              <div class="enrollment-info">
                <strong>{{ enrollment.policyName }}</strong>
                <span class="enrollment-date">Enrolled: {{ enrollment.enrolledDate | date:'mediumDate' }}</span>
              </div>
              <div class="enrollment-status">
                <span class="badge" [ngClass]="getBadgeClass(enrollment.status)">
                  {{ enrollment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
      text-align: center;
    }

    .page-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .page-header p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-lg);
      margin: var(--spacing-sm) 0 0 0;
    }

    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-2xl);
    }

    .policy-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-1);
      transition: all 0.2s ease;
      border: 1px solid var(--outline-variant);
    }

    .policy-card:hover {
      box-shadow: var(--shadow-2);
      transform: translateY(-4px);
    }

    .policy-header {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }

    .policy-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--spacing-md);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .policy-icon.health { background: var(--success-500); }
    .policy-icon.life { background: var(--primary-500); }
    .policy-icon.accident { background: var(--warning-500); }
    .policy-icon.critical { background: var(--error-500); }

    .policy-icon .material-icons {
      font-size: 32px;
    }

    .policy-card h3 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .policy-premium {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .policy-features {
      margin: var(--spacing-lg) 0;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .feature .material-icons {
      font-size: 16px;
      color: var(--success-500);
    }

    .policy-coverage {
      background: var(--surface-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      margin: var(--spacing-lg) 0;
      text-align: center;
    }

    .coverage-label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin-bottom: var(--spacing-xs);
    }

    .coverage-amount {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
    }

    .btn {
      width: 100%;
      padding: var(--spacing-md);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-500);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-600);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .enrollment-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .enrollment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .enrollment-info strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .enrollment-date {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
    }

    .badge-active {
      background: var(--success-100);
      color: var(--success-700);
    }

    .badge-pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    @media (max-width: 768px) {
      .policies-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InsuranceEnrollmentComponent implements OnInit {
  availablePolicies: any[] = [];
  myEnrollments: any[] = [];
  isLoading = false;

  constructor(
    private insuranceService: InsuranceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPolicies();
    this.loadMyEnrollments();
  }

  loadPolicies() {
    this.availablePolicies = [
      {
        id: 1,
        name: 'Health Insurance',
        type: 'health',
        icon: 'health_and_safety',
        premium: 25000,
        coverage: 5000000,
        features: [
          'Hospitalization Coverage',
          'OPD Benefits',
          'Pre/Post Hospitalization',
          'Ambulance Coverage'
        ]
      },
      {
        id: 2,
        name: 'Term Life Insurance',
        type: 'life',
        icon: 'favorite',
        premium: 12000,
        coverage: 10000000,
        features: [
          'Life Coverage',
          'Accidental Death Benefit',
          'Terminal Illness Benefit',
          'Premium Waiver'
        ]
      },
      {
        id: 3,
        name: 'Accidental Insurance',
        type: 'accident',
        icon: 'security',
        premium: 8000,
        coverage: 3000000,
        features: [
          'Accidental Death',
          'Permanent Disability',
          'Temporary Disability',
          '24/7 Coverage'
        ]
      },
      {
        id: 4,
        name: 'Critical Illness',
        type: 'critical',
        icon: 'local_hospital',
        premium: 18000,
        coverage: 7500000,
        features: [
          'Cancer Coverage',
          'Heart Disease',
          'Stroke Coverage',
          'Kidney Failure'
        ]
      }
    ];
  }

  loadMyEnrollments() {
    // Load from API or demo data
    this.myEnrollments = [
      {
        id: 1,
        policyName: 'Health Insurance',
        enrolledDate: new Date(2024, 0, 15),
        status: 'Active'
      }
    ];
  }

  enrollInPolicy(policy: any) {
    this.isLoading = true;
    
    const enrollmentData = {
      employeeId: 1, // Get from auth service
      policyId: policy.id,
      policyName: policy.name
    };

    this.insuranceService.enrollInPolicy(enrollmentData).subscribe({
      next: () => {
        this.isLoading = false;
        alert(`Successfully enrolled in ${policy.name}!`);
        this.loadMyEnrollments();
      },
      error: () => {
        this.isLoading = false;
        alert('Enrollment failed. Please try again.');
      }
    });
  }

  getBadgeClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}