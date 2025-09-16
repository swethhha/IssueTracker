import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { MedicalClaimService } from '../../services/medical-claim.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medical-claim-list',
  imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './medical-claim-list.component.html',
  styleUrls: ['./medical-claim-list.component.scss']
})
export class MedicalClaimListComponent implements OnInit {
  claims: any[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = '';
  showForm = false;
  claimForm: FormGroup;
  submitting = false;
  selectedFiles: File[] = [];

  treatmentTypes = [
    'Diagnostic Tests',
    'Surgery',
    'Hospitalization',
    'Consultation',
    'Emergency Treatment',
    'Preventive Care',
    'Dental Treatment',
    'Eye Care'
  ];

  constructor(
    private medicalClaimService: MedicalClaimService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.claimForm = this.fb.group({
      claimAmount: ['', [Validators.required, Validators.min(1)]],
      treatmentDate: ['', Validators.required],
      hospitalName: ['', Validators.required],
      treatmentType: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadClaims();
  }

  loadClaims() {
    this.loading = true;
    this.medicalClaimService.getMyClaims().subscribe({
      next: (data: any) => {
        this.claims = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load medical claims';
        this.loading = false;
        console.error('Medical claims error:', error);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.claimForm.reset();
      this.selectedFiles = [];
    }
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.claimForm.valid) {
      this.submitting = true;
      const formData = new FormData();
      
      Object.keys(this.claimForm.value).forEach(key => {
        formData.append(key, this.claimForm.value[key]);
      });

      this.selectedFiles.forEach(file => {
        formData.append('documents', file);
      });

      this.medicalClaimService.submitClaim(formData).subscribe({
        next: () => {
          this.submitting = false;
          this.showForm = false;
          this.claimForm.reset();
          this.selectedFiles = [];
          this.loadClaims();
        },
        error: (error: any) => {
          this.submitting = false;
          console.error('Claim submission error:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  canSubmit(): boolean {
    return this.userRole === 'Employee' || this.userRole === 'Manager';
  }
}