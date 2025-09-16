import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./medical-approvals.component.css'],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Medical Claim Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Claims</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let claim of filteredClaims" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ claim.employeeName }}</h3>
              <p>{{ claim.department }} • {{ claim.claimType }}</p>
            </div>
            <div class="status-badge" [class]="claim.status">
              {{ claim.status | titlecase }}
            </div>
          </div>

          <div class="claim-details">
            <div class="claim-summary">
              <div class="summary-grid">
                <div class="detail-item">
                  <span class="label">Claim Amount:</span>
                  <span class="value amount">\${{ claim.claimAmount | number:'1.2-2' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Treatment Date:</span>
                  <span class="value">{{ claim.treatmentDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Hospital/Clinic:</span>
                  <span class="value">{{ claim.hospitalName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Policy Coverage:</span>
                  <span class="value">\${{ claim.policyCoverage | number:'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="claim.status === 'pending'" class="approval-actions">
            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveClaim(claim)"
              >
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectClaim(claim)"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MedicalApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  claims = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      claimType: 'Hospitalization',
      claimAmount: 8500,
      treatmentDate: '2024-12-05',
      hospitalName: 'City General Hospital',
      policyCoverage: 500000,
      status: 'pending'
    }
  ];

  get filteredClaims() {
    if (this.selectedFilter === 'all') {
      return this.claims;
    }
    return this.claims.filter(c => c.status === this.selectedFilter);
  }

  ngOnInit() {}

  approveClaim(claim: any) {
    claim.status = 'approved';
    alert(`Medical claim approved for ${claim.employeeName}`);
  }

  rejectClaim(claim: any) {
    claim.status = 'rejected';
    alert(`Medical claim rejected for ${claim.employeeName}`);
  }
}