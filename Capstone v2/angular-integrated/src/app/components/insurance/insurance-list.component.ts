import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceService } from '../../services/insurance.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-insurance-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Available Policies -->
    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-shield me-2"></i>Available Insurance Policies</h5>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-6 mb-4" *ngFor="let policy of availablePolicies">
                <div class="card border">
                  <div class="card-block">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h6 class="mb-0">{{ policy.name }}</h6>
                      <span class="badge badge-success">Available</span>
                    </div>
                    <p class="text-muted mb-3">{{ policy.description }}</p>
                    <div class="mb-3">
                      <small class="text-muted">Coverage Amount</small>
                      <div class="fw-bold text-primary">{{ policy.coverage }}</div>
                    </div>
                    <button 
                      class="btn btn-primary btn-sm"
                      (click)="enrollInPolicy(policy)"
                      [disabled]="checkEnrollment(policy.id)"
                    >
                      <i class="feather icon-plus me-1"></i>
                      {{ isEnrolled(policy.id) ? 'Applied' : 'Apply Now' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrollment Form -->
      <div class="col-xl-4">
        <div class="card" *ngIf="selectedPolicy">
          <div class="card-header">
            <h5>Enroll in {{ selectedPolicy.name }}</h5>
          </div>
          <div class="card-block">
            <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()">
              <div class="form-group mb-3">
                <label>Employee ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [value]="currentEmployeeId"
                  readonly
                />
              </div>
              
              <div class="form-group mb-3">
                <label>Coverage Type</label>
                <select class="form-control" formControlName="coverageType">
                  <option value="individual">Individual</option>
                  <option value="family">Family</option>
                </select>
              </div>

              <div class="form-group mb-3" *ngIf="enrollmentForm.get('coverageType')?.value === 'family'">
                <label>Number of Dependents</label>
                <input 
                  type="number" 
                  class="form-control" 
                  formControlName="dependentCount"
                  min="1"
                  max="5"
                />
              </div>

              <div class="alert alert-info mb-3">
                <h6>Premium Calculation</h6>
                <div class="d-flex justify-content-between">
                  <span>Base Premium:</span>
                  <span>{{ selectedPolicy.premium | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="d-flex justify-content-between" *ngIf="enrollmentForm.get('coverageType')?.value === 'family'">
                  <span>Family Addition:</span>
                  <span>{{ calculateFamilyPremium() | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                  <span>Total Monthly:</span>
                  <span>{{ calculateTotalPremium() | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>

              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-success"
                  [disabled]="enrollmentForm.invalid || isSubmitting"
                >
                  <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSubmitting ? 'Enrolling...' : 'Complete Enrollment' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- My Enrollments -->
        <div class="card">
          <div class="card-header">
            <h5>My Enrollments</h5>
          </div>
          <div class="card-block">
            <div *ngFor="let enrollment of myEnrollments" class="border-bottom pb-3 mb-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">{{ enrollment.policyName }}</h6>
                  <small class="text-muted">{{ enrollment.premium | currency:'INR':'symbol':'1.0-0' }}/month</small>
                </div>
                <span class="badge badge-success">Active</span>
              </div>
              <small class="text-muted">Enrolled: {{ enrollment.enrollmentDate | date:'shortDate' }}</small>
            </div>
            <div *ngIf="myEnrollments.length === 0" class="text-center text-muted">
              <i class="feather icon-inbox f-30 mb-2 d-block"></i>
              No active enrollments
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .border {
      border: 1px solid #e9ecef !important;
    }
    .badge {
      font-size: 0.75rem;
    }
  `]
})
export class InsuranceListComponent implements OnInit {
  availablePolicies = [
    {
      id: 1,
      name: 'Group Health Insurance (GHI)',
      description: 'Covers hospitalization expenses for employee + family.',
      coverage: '₹5 Lakhs'
    },
    {
      id: 2,
      name: 'Group Term Life Insurance',
      description: 'Provides financial security to employee\'s family in case of death.',
      coverage: '3x Annual Salary'
    },
    {
      id: 3,
      name: 'Accidental Death & Disability Insurance (AD&D)',
      description: 'Covers accidental death or permanent disability.',
      coverage: '₹10 Lakhs'
    },
    {
      id: 4,
      name: 'Critical Illness Insurance',
      description: 'Lump-sum payout on diagnosis of critical illnesses.',
      coverage: '₹5 Lakhs'
    }
  ];

  myEnrollments: any[] = [];

  selectedPolicy: any = null;
  enrollmentForm: FormGroup;
  isSubmitting = false;
  currentEmployeeId = '12345';

  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private authService: AuthService
  ) {
    this.enrollmentForm = this.fb.group({
      coverageType: ['individual', Validators.required],
      dependentCount: [0]
    });
  }

  ngOnInit(): void {
    this.loadPolicies();
    this.loadMyEnrollments();
    this.getCurrentUser();
  }

  loadPolicies(): void {
    this.insuranceService.getPolicies().subscribe({
      next: (policies) => {
        if (policies && policies.length > 0) {
          this.availablePolicies = policies;
        }
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        // Keep hardcoded policies as fallback
      }
    });
  }

  loadMyEnrollments(): void {
    this.insuranceService.getMyEnrollments().subscribe({
      next: (enrollments: any[]) => {
        this.myEnrollments = enrollments;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.myEnrollments = [];
      }
    });
  }

  getCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentEmployeeId = user.id.toString();
      }
    });
  }

  enrollInPolicy(policy: any): void {
    if (!this.isEnrolled(policy.id)) {
      this.selectedPolicy = policy;
    }
  }

  isEnrolled(policyId: number): boolean {
    return this.myEnrollments.some(e => e.id === policyId);
  }

  checkEnrollment(policyId: number): boolean {
    return this.myEnrollments.some(e => e.id === policyId);
  }

  calculateFamilyPremium(): number {
    const dependentCount = this.enrollmentForm.get('dependentCount')?.value || 0;
    return dependentCount * 100; // $100 per dependent
  }

  getBasePremium(): number {
    if (!this.selectedPolicy) return 0;
    
    // Calculate base premium based on policy type
    switch (this.selectedPolicy.id) {
      case 1: return 500; // Group Health Insurance
      case 2: return 300; // Group Term Life Insurance
      case 3: return 200; // AD&D Insurance
      case 4: return 400; // Critical Illness Insurance
      default: return 250;
    }
  }

  calculateTotalPremium(): number {
    if (!this.selectedPolicy) return 0;
    
    let total = this.getBasePremium();
    if (this.enrollmentForm.get('coverageType')?.value === 'family') {
      total += this.calculateFamilyPremium();
    }
    return total;
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid && this.selectedPolicy) {
      this.isSubmitting = true;
      
      const enrollmentData = {
        policyId: this.selectedPolicy.id,
        coverageType: this.enrollmentForm.get('coverageType')?.value,
        dependentCount: this.enrollmentForm.get('dependentCount')?.value || 0,
        totalPremium: this.calculateTotalPremium()
      };
      
      this.insuranceService.enrollInPolicy(enrollmentData).subscribe({
        next: (response) => {
          this.loadMyEnrollments();
          this.selectedPolicy = null;
          this.enrollmentForm.reset({ coverageType: 'individual', dependentCount: 0 });
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error enrolling in policy:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}