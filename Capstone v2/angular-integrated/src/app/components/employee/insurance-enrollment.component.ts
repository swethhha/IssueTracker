import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockPayrollService } from '../../services/mock-payroll.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-insurance-enrollment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #f8fafc; min-height: 100vh;">
      <h1 style="text-align: center; margin-bottom: 30px; color: #1e293b;" *ngIf="!isFinanceUser">Insurance Policies</h1>
      <h1 style="text-align: center; margin-bottom: 30px; color: #1e293b;" *ngIf="isFinanceUser">Insurance Enrollment Approvals</h1>
      
      <!-- Finance Approval View -->
      <div *ngIf="isFinanceUser" class="finance-view">
        <div class="page-header">
          <h1>Insurance Enrollment Approvals</h1>
          <p>Review and approve employee insurance enrollments</p>
        </div>

        <div class="approval-container">
          <div class="approval-stats">
            <div class="stat-card">
              <div class="stat-value">{{ pendingEnrollments.length }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹{{ getTotalMonthlyCost() | number:'1.0-0' }}</div>
              <div class="stat-label">Monthly Cost</div>
            </div>
          </div>

          <div class="approval-list">
            <div class="approval-item" *ngFor="let enrollment of pendingEnrollments">
              <div class="enrollment-header">
                <h3>{{ enrollment.employeeName }}</h3>
                <span class="status-badge pending">Pending Review</span>
              </div>
              
              <div class="enrollment-details">
                <div class="detail-row">
                  <span class="label">Policy Type:</span>
                  <span class="value">{{ enrollment.policyType }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Coverage Amount:</span>
                  <span class="value amount">₹{{ enrollment.coverageAmount | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Monthly Premium:</span>
                  <span class="value">₹{{ enrollment.monthlyPremium | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Company Contribution:</span>
                  <span class="value">{{ enrollment.companyContribution }}%</span>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn btn-info" (click)="verifyDocuments(enrollment)">Verify Documents</button>
                <button class="btn btn-success" (click)="approveEnrollment(enrollment)">Approve Enrollment</button>
                <button class="btn btn-danger" (click)="rejectEnrollment(enrollment)">Reject</button>
              </div>
            </div>

            <div *ngIf="pendingEnrollments.length === 0" class="empty-state">
              <span class="material-icons">check_circle</span>
              <h3>No Pending Enrollments</h3>
              <p>All insurance enrollments have been processed</p>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="!isFinanceUser">
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%; margin: 0;">
        
        <!-- Group Mediclaim -->
        <div class="policy-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div class="policy-icon health">
              <span class="material-icons">local_hospital</span>
            </div>
            <div>
              <h2 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Group Mediclaim</h2>
              <span style="background: #dbeafe; color: #1d4ed8; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">MOST POPULAR</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 28px; font-weight: bold; color: #2563eb;">₹4 Lakhs</div>
            <div style="color: #64748b; font-size: 14px;">Family Floater</div>
            <div style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-top: 8px; display: inline-block;">FREE FOR EMPLOYEE</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">COVERAGE</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Comprehensive health coverage for employee and family</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Pre & Post hospitalization expenses covered</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Day care procedures and surgeries</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Maternity benefits with newborn coverage</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ No waiting period for most treatments</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">PREMIUM</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Employee: <strong>FREE</strong></li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Spouse: ₹1,500/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Child: ₹1,200/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Parent: ₹3,500/year</li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button [style.background]="isEnrolled('mediclaim') ? '#64748b' : '#2563eb'" style="flex: 1; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="startEnrollment('mediclaim')" [disabled]="isEnrolled('mediclaim')">
              {{ isEnrolled('mediclaim') ? 'Enrolled' : 'Upload Documents' }}
            </button>
            <button style="flex: 1; background: transparent; color: #2563eb; border: 2px solid #2563eb; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="viewDetails('mediclaim')">
              View Details
            </button>
          </div>
        </div>

        <!-- Term Life Insurance -->
        <div class="policy-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div class="policy-icon life">
              <span class="material-icons">security</span>
            </div>
            <div>
              <h2 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Term Life Insurance</h2>
              <span style="background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">NEW</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 28px; font-weight: bold; color: #2563eb;">₹25 Lakhs</div>
            <div style="color: #64748b; font-size: 14px;">Individual Coverage</div>
            <div style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-top: 8px; display: inline-block;">PAID (60% COMPANY)</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">COVERAGE</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Financial security for your family in case of death</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Double coverage for accidental death</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Terminal illness advance payment option</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Permanent disability coverage included</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Tax benefits under Section 80C</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">PREMIUM</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Age 25-30: ₹4,500/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Age 31-35: ₹6,800/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Age 36-40: ₹9,200/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Company Share: <strong>60%</strong></li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button [style.background]="isEnrolled('term-life') ? '#64748b' : '#10b981'" style="flex: 1; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="startEnrollment('term-life')" [disabled]="isEnrolled('term-life')">
              {{ isEnrolled('term-life') ? 'Enrolled' : 'Upload Documents' }}
            </button>
            <button style="flex: 1; background: transparent; color: #10b981; border: 2px solid #10b981; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="viewDetails('term-life')">
              View Details
            </button>
          </div>
        </div>

        <!-- Personal Accident -->
        <div class="policy-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div class="policy-icon accident">
              <span class="material-icons">emergency</span>
            </div>
            <div>
              <h2 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Personal Accident</h2>
              <span style="background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">ESSENTIAL</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 28px; font-weight: bold; color: #2563eb;">₹5 Lakhs</div>
            <div style="color: #64748b; font-size: 14px;">Individual + Family</div>
            <div style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-top: 8px; display: inline-block;">100% FREE</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">COVERAGE</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Protection against accidental death and injuries</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Permanent and temporary disability benefits</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Medical expenses for accident-related treatment</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ 24x7 worldwide coverage including travel</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Emergency ambulance and hospitalization</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">PREMIUM</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Employee: ₹1,800/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Spouse: ₹1,200/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Child: ₹800/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Company Pays: <strong>100%</strong></li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button [style.background]="isEnrolled('accident') ? '#64748b' : '#f59e0b'" style="flex: 1; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="startEnrollment('accident')" [disabled]="isEnrolled('accident')">
              {{ isEnrolled('accident') ? 'Enrolled' : 'Upload Documents' }}
            </button>
            <button style="flex: 1; background: transparent; color: #f59e0b; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="viewDetails('accident')">
              View Details
            </button>
          </div>
        </div>

        <!-- Critical Illness -->
        <div class="policy-card" style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div class="policy-icon critical">
              <span class="material-icons">healing</span>
            </div>
            <div>
              <h2 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Critical Illness</h2>
              <span style="background: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">COMPREHENSIVE</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="font-size: 28px; font-weight: bold; color: #2563eb;">₹15 Lakhs</div>
            <div style="color: #64748b; font-size: 14px;">Individual Coverage</div>
            <div style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-top: 8px; display: inline-block;">PAID (60% COMPANY)</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">COVERED ILLNESSES</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Cancer treatment and related expenses</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Heart attack and cardiac procedures</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Stroke and neurological conditions</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ Kidney failure and organ transplants</li>
              <li style="color: #10b981; margin-bottom: 8px; font-size: 14px;">✓ 30+ major critical illnesses covered</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">PREMIUM</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Age 25-35: ₹8,500/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Age 36-45: ₹12,800/year</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Employee Share: 40%</li>
              <li style="color: #64748b; margin-bottom: 6px; font-size: 14px;">Company Share: <strong>60%</strong></li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button [style.background]="isEnrolled('critical-illness') ? '#64748b' : '#8b5cf6'" style="flex: 1; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="startEnrollment('critical-illness')" [disabled]="isEnrolled('critical-illness')">
              {{ isEnrolled('critical-illness') ? 'Enrolled' : 'Upload Documents' }}
            </button>
            <button style="flex: 1; background: transparent; color: #8b5cf6; border: 2px solid #8b5cf6; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: 600;" (click)="viewDetails('critical-illness')">
              View Details
            </button>
          </div>
        </div>

      </div>
      
      <div *ngIf="!isFinanceUser && enrolledPolicies.length > 0" style="width: 100%; margin: 3rem 0 0 0; padding: 0 20px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">My Insurance Policies</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div *ngFor="let policy of enrolledPolicies" [style.border]="'2px solid ' + getStatusColor(policy.status)" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0; color: #1e293b;">{{ policy.name }}</h3>
              <span [style.background]="getStatusBg(policy.status)" [style.color]="getStatusColor(policy.status)" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">{{ policy.status.toUpperCase() }}</span>
            </div>
            <p style="color: #64748b; margin: 5px 0;">Coverage: {{ policy.coverage }}</p>
            <p style="color: #64748b; margin: 5px 0;">Premium: {{ policy.premium }}</p>
            <p style="color: #64748b; margin: 5px 0;">Enrolled: {{ policy.enrolledDate | date:'MMM dd, yyyy' }}</p>
            
            <!-- Document Upload Section -->
            <div *ngIf="policy.status === 'Enrolled'" style="margin: 15px 0; padding: 15px; background: #fef3c7; border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">Documents Required:</h4>
              <div style="margin-bottom: 10px;">
                <input type="file" (change)="onDocumentUpload($event, policy.id)" accept=".pdf,.jpg,.png" style="margin-bottom: 5px;">
                <p style="font-size: 12px; color: #92400e; margin: 0;">Upload required documents to activate policy</p>
              </div>
              <button *ngIf="policy.documentsUploaded" (click)="activatePolicy(policy.id)" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                Activate Policy
              </button>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button *ngIf="policy.status === 'Active'" (click)="downloadECard(policy.id)" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; flex: 1;">
                Download E-Card
              </button>
              <button *ngIf="policy.status === 'Enrolled'" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; flex: 1;" disabled>
                Pending Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div *ngIf="showDetailsModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;" (click)="closeModal()">
      <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;" (click)="$event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1e293b;">{{ selectedPolicy?.name }} - Requirements</h2>
          <button style="background: none; border: none; font-size: 24px; cursor: pointer;" (click)="closeModal()">×</button>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Eligibility Requirements:</h3>
          <ul style="color: #64748b; line-height: 1.6;">
            <li *ngFor="let req of selectedPolicy?.requirements">{{ req }}</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Required Documents:</h3>
          <ul style="color: #64748b; line-height: 1.6;">
            <li *ngFor="let doc of selectedPolicy?.documents">{{ doc }}</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Terms & Conditions:</h3>
          <ul style="color: #64748b; line-height: 1.6;">
            <li *ngFor="let term of selectedPolicy?.terms">{{ term }}</li>
          </ul>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button style="background: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;" (click)="closeModal()">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Document Upload Modal -->
    <div *ngIf="showUploadModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;" (click)="closeUploadModal()">
      <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 100%; max-height: 70vh; overflow-y: auto; margin: auto;" (click)="$event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1e293b;">Upload Documents - {{ selectedEnrollmentPolicy?.name }}</h2>
          <button style="background: none; border: none; font-size: 24px; cursor: pointer;" (click)="closeUploadModal()">×</button>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Required Documents:</h3>
          <ul style="color: #64748b; line-height: 1.6; margin-bottom: 15px;">
            <li *ngFor="let doc of selectedEnrollmentPolicy?.documents">{{ doc }}</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151;">Upload Documents:</label>
          <input type="file" (change)="onDocumentSelect($event)" accept=".pdf,.jpg,.png,.jpeg" multiple style="width: 100%; padding: 10px; border: 2px dashed #e2e8f0; border-radius: 8px; cursor: pointer;">
          <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">Accepted formats: PDF, JPG, PNG. Multiple files allowed.</p>
        </div>
        
        <div *ngIf="selectedFiles.length > 0" style="margin-bottom: 20px;">
          <h4 style="color: #374151; margin-bottom: 10px;">Selected Files:</h4>
          <div *ngFor="let file of selectedFiles" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f8fafc; border-radius: 6px; margin-bottom: 5px;">
            <span style="color: #64748b; font-size: 14px;">{{ file.name }}</span>
            <button (click)="removeFile(file)" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              Remove
            </button>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button style="background: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;" (click)="closeUploadModal()">
            Cancel
          </button>
          <button [disabled]="selectedFiles.length === 0" [style.background]="selectedFiles.length === 0 ? '#9ca3af' : '#10b981'" style="color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;" (click)="completeEnrollment()">
            Complete Enrollment
          </button>
        </div>
      </div>
    </div>

    <style>
      .policy-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
      }
      
      .policy-card:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #2563eb;
        border-radius: 12px 12px 0 0;
      }

      /* Finance Approval Styles */
      .finance-view {
        width: 100%;
        padding: var(--spacing-lg);
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

      .approval-container {
        background: var(--surface);
        border-radius: var(--radius-xl);
        padding: var(--spacing-2xl);
        box-shadow: var(--shadow-1);
      }

      .approval-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-2xl);
      }

      .stat-card {
        background: var(--primary-50);
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        text-align: center;
      }

      .stat-value {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--primary-600);
        margin-bottom: var(--spacing-xs);
      }

      .stat-label {
        font-size: var(--font-size-sm);
        color: var(--on-surface-variant);
      }

      .approval-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .approval-item {
        background: var(--surface-variant);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
      }

      .enrollment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }

      .enrollment-header h3 {
        margin: 0;
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
      }

      .status-badge {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .status-badge.pending {
        background: var(--warning-100);
        color: var(--warning-700);
      }

      .enrollment-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-lg);
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-xs) 0;
      }

      .detail-row .label {
        font-weight: var(--font-weight-medium);
        color: var(--on-surface-variant);
      }

      .detail-row .value {
        font-weight: var(--font-weight-semibold);
      }

      .detail-row .amount {
        color: var(--primary-600);
        font-size: var(--font-size-lg);
      }

      .approval-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
      }

      .btn {
        padding: var(--spacing-sm) var(--spacing-lg);
        border: none;
        border-radius: var(--radius-md);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-info {
        background: var(--info-100);
        color: var(--info-700);
      }

      .btn-success {
        background: var(--success-500);
        color: white;
      }

      .btn-danger {
        background: var(--error-500);
        color: white;
      }

      .btn:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-2);
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--on-surface-variant);
      }

      .empty-state .material-icons {
        font-size: 48px;
        color: var(--success-500);
        margin-bottom: var(--spacing-md);
      }

      .policy-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .policy-icon.health {
        background: linear-gradient(135deg, #10b981, #059669);
      }

      .policy-icon.life {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      }

      .policy-icon.accident {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }

      .policy-icon.critical {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      }

      .policy-icon .material-icons {
        font-size: 28px;
      }
    </style>
  `
})
export class InsuranceEnrollmentComponent implements OnInit {
  constructor(
    private router: Router, 
    private mockPayrollService: MockPayrollService, 
    private toastService: ToastService,
    private authService: AuthService
  ) {}
  showDetailsModal = false;
  showUploadModal = false;
  selectedPolicy: any = null;
  selectedEnrollmentPolicy: any = null;
  selectedFiles: File[] = [];
  currentEnrollmentType = '';
  enrolledPolicies: any[] = [];
  isFinanceUser = false;
  pendingEnrollments: any[] = [];
  
  policyDetails = {
    'mediclaim': {
      name: 'Group Mediclaim',
      requirements: [
        'Must be a permanent employee',
        'Minimum 3 months of service',
        'Age limit: 18-65 years for employee',
        'Spouse age limit: 18-65 years',
        'Children age limit: 3 months to 25 years'
      ],
      documents: [
        'Employee ID proof',
        'Family members ID proof',
        'Birth certificates for children',
        'Marriage certificate for spouse',
        'Medical history declaration'
      ],
      terms: [
        'Pre-existing diseases covered after 2 years',
        'Maternity benefits available after 9 months',
        'Room rent limit applies as per policy',
        'Network hospital cashless facility available',
        'Annual health check-up included'
      ]
    },
    'term-life': {
      name: 'Term Life Insurance',
      requirements: [
        'Age limit: 18-55 years at entry',
        'Medical examination required above age 40',
        'Minimum sum assured: ₹10 Lakhs',
        'Good health declaration mandatory',
        'No adverse lifestyle habits'
      ],
      documents: [
        'Age proof document',
        'Income proof (salary slips)',
        'Medical examination reports',
        'Identity and address proof',
        'Nominee details and documents'
      ],
      terms: [
        'Premium increases with age',
        'Policy renewable up to age 65',
        'Suicide exclusion for first 12 months',
        'Grace period of 30 days for premium payment',
        'Tax benefits under Section 80C and 10(10D)'
      ]
    },
    'accident': {
      name: 'Personal Accident Insurance',
      requirements: [
        'Age limit: 18-65 years',
        'Engaged in non-hazardous occupation',
        'Good physical and mental health',
        'No pre-existing disabilities',
        'Regular employment status'
      ],
      documents: [
        'Employment certificate',
        'Age and identity proof',
        'Medical fitness certificate',
        'Occupation details',
        'Nominee information'
      ],
      terms: [
        'Coverage valid worldwide 24x7',
        'Immediate coverage from policy start date',
        'No medical examination required',
        'Hazardous activities excluded',
        'Claims settled within 30 days'
      ]
    },
    'critical-illness': {
      name: 'Critical Illness Insurance',
      requirements: [
        'Age limit: 18-55 years at entry',
        'Comprehensive medical examination',
        'No family history of critical illness',
        'Lifestyle questionnaire completion',
        'Minimum 2 years employment'
      ],
      documents: [
        'Detailed medical history',
        'Family medical history',
        'Laboratory test reports',
        'Specialist consultation reports',
        'Lifestyle and habits declaration'
      ],
      terms: [
        'Waiting period of 90 days for most illnesses',
        'Cancer waiting period of 180 days',
        'Survival period of 30 days required',
        'Lump sum benefit on diagnosis',
        'Policy continues after first claim'
      ]
    }
  };

  viewDetails(policyType: string) {
    this.selectedPolicy = (this.policyDetails as any)[policyType];
    this.showDetailsModal = true;
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedPolicy = null;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedEnrollmentPolicy = null;
    this.selectedFiles = [];
    this.currentEnrollmentType = '';
  }

  startEnrollment(policyType: string) {
    if (this.isEnrolled(policyType)) {
      return;
    }
    
    this.currentEnrollmentType = policyType;
    this.selectedEnrollmentPolicy = (this.policyDetails as any)[policyType];
    this.showUploadModal = true;
    
    // Scroll to top when modal opens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  onDocumentSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  completeEnrollment() {
    if (this.selectedFiles.length === 0) {
      this.toastService.warning('Documents Required', 'Please upload at least one document to complete enrollment');
      return;
    }

    // Process enrollment with documents
    this.enrollPolicy(this.currentEnrollmentType);
    this.closeUploadModal();
  }

  enrollPolicy(policyType: string) {
    const policyNames: any = {
      'mediclaim': 'Group Mediclaim',
      'term-life': 'Term Life Insurance', 
      'accident': 'Personal Accident',
      'critical-illness': 'Critical Illness'
    };
    
    const coverages: any = {
      'mediclaim': '₹4 Lakhs',
      'term-life': '₹25 Lakhs',
      'accident': '₹5 Lakhs', 
      'critical-illness': '₹15 Lakhs'
    };
    
    const premiums: any = {
      'mediclaim': 'FREE (Employee)',
      'term-life': '₹4,500-₹9,200/year',
      'accident': '₹1,800/year',
      'critical-illness': '₹8,500-₹12,800/year'
    };

    const newPolicy = {
      id: this.enrolledPolicies.length + 1,
      name: policyNames[policyType],
      coverage: coverages[policyType],
      premium: premiums[policyType],
      enrolledDate: new Date(),
      status: 'Active',
      documentsUploaded: true,
      uploadedFiles: this.selectedFiles.map(f => f.name)
    };

    // Check if already enrolled
    const alreadyEnrolled = this.enrolledPolicies.find(p => p.name === newPolicy.name);
    if (alreadyEnrolled) {
      this.toastService.warning('Already Enrolled', 'You are already enrolled in this policy!');
      return;
    }

    this.enrolledPolicies.push(newPolicy);
    this.saveEnrolledPolicies();
    this.addInsuranceToMockData(policyType);
    this.toastService.success('Insurance Enrolled', `Successfully enrolled in ${newPolicy.name}! Your policy is now active`);
    
    // Redirect to medical claims after enrollment
    setTimeout(() => {
      this.router.navigate(['/medical-claims/submit']);
    }, 2000);
  }

  onDocumentUpload(event: any, policyId: number) {
    const file = event.target.files[0];
    if (file) {
      const policy = this.enrolledPolicies.find(p => p.id === policyId);
      if (policy) {
        policy.documentsUploaded = true;
        this.toastService.success('Document Uploaded', `Document "${file.name}" uploaded successfully!`);
      }
    }
  }

  activatePolicy(policyId: number) {
    const policy = this.enrolledPolicies.find(p => p.id === policyId);
    if (policy && policy.documentsUploaded) {
      policy.status = 'Active';
      this.toastService.success('Policy Activated', `${policy.name} has been activated! You can now download your E-Card`);
    }
  }

  downloadECard(policyId: number) {
    const policy = this.enrolledPolicies.find(p => p.id === policyId);
    if (policy && policy.status === 'Active') {
      const pdfContent = `PAYROLL360 INSURANCE E-CARD\n=====================================\n\nPolicy Name: ${policy.name}\nCoverage: ${policy.coverage}\nPremium: ${policy.premium}\nStatus: ${policy.status}\nEnrolled Date: ${new Date(policy.enrolledDate).toDateString()}\n\nPolicy ID: POL${policy.id}\nEmployee: John Doe\nEmployee ID: EMP001\n\nThis is your digital insurance card.\nKeep this for your records.\n\nFor claims, contact: claims@payroll360.com\nEmergency: 1800-123-4567`;
      
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${policy.name.replace(/\s+/g, '_')}_ECard.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      this.toastService.success('E-Card Downloaded', `E-Card for ${policy.name} downloaded successfully!`);
    } else {
      this.toastService.error('Download Failed', 'Policy must be active to download E-Card');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Enrolled': return '#f59e0b';
      case 'Pending': return '#64748b';
      default: return '#64748b';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'Active': return '#dcfce7';
      case 'Enrolled': return '#fef3c7';
      case 'Pending': return '#f1f5f9';
      default: return '#f1f5f9';
    }
  }

  isEnrolled(policyType: string): boolean {
    const policyNames: any = {
      'mediclaim': 'Group Mediclaim',
      'term-life': 'Term Life Insurance',
      'accident': 'Personal Accident',
      'critical-illness': 'Critical Illness'
    };
    return this.enrolledPolicies.some(p => p.name === policyNames[policyType]);
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isFinanceUser = user?.role === 'Finance';
      if (this.isFinanceUser) {
        this.loadPendingEnrollments();
      } else {
        this.loadEnrolledPolicies();
      }
    });
  }

  loadPendingEnrollments() {
    this.pendingEnrollments = [
      {
        id: 1,
        employeeName: 'John Doe',
        policyType: 'Group Mediclaim Policy',
        coverageAmount: 500000,
        monthlyPremium: 0,
        companyContribution: 100
      },
      {
        id: 2,
        employeeName: 'Alice Smith',
        policyType: 'Family Health Coverage',
        coverageAmount: 800000,
        monthlyPremium: 1500,
        companyContribution: 70
      }
    ];
  }

  loadEnrolledPolicies() {
    const policies = localStorage.getItem('enrolledPolicies');
    this.enrolledPolicies = policies ? JSON.parse(policies) : [];
  }

  saveEnrolledPolicies() {
    localStorage.setItem('enrolledPolicies', JSON.stringify(this.enrolledPolicies));
  }

  addInsuranceToMockData(policyType: string) {
    const currentUser = this.mockPayrollService.getCurrentUser();
    if (currentUser) {
      const data = JSON.parse(localStorage.getItem('payroll-demo-data') || '{}');
      if (!data.insurances) data.insurances = [];
      
      const insuranceTypeMap: any = {
        'mediclaim': { type: 'Health', provider: 'Star Health', coverage: 500000 },
        'term-life': { type: 'Life', provider: 'LIC', coverage: 2500000 },
        'accident': { type: 'Accident', provider: 'HDFC ERGO', coverage: 500000 },
        'critical-illness': { type: 'Health', provider: 'Max Bupa', coverage: 1500000 }
      };
      
      const insuranceData = insuranceTypeMap[policyType];
      if (insuranceData) {
        const newInsurance = {
          id: Date.now(),
          employeeId: currentUser.id,
          insuranceType: insuranceData.type,
          provider: insuranceData.provider,
          policyNumber: 'POL' + Date.now(),
          enrollmentDate: new Date().toISOString().split('T')[0],
          isActive: true,
          coverageAmount: insuranceData.coverage
        };
        
        data.insurances.push(newInsurance);
        localStorage.setItem('payroll-demo-data', JSON.stringify(data));
      }
    }
  }

  enrollFromModal() {
    this.closeModal();
    const policyTypeMap: any = {
      'Group Mediclaim': 'mediclaim',
      'Term Life Insurance': 'term-life',
      'Personal Accident Insurance': 'accident', 
      'Critical Illness Insurance': 'critical-illness'
    };
    const policyType = policyTypeMap[this.selectedPolicy?.name];
    if (policyType) {
      this.enrollPolicy(policyType);
    }
  }

  getTotalMonthlyCost(): number {
    return this.pendingEnrollments.reduce((total, enrollment) => 
      total + (enrollment.monthlyPremium * enrollment.companyContribution / 100), 0
    );
  }

  verifyDocuments(enrollment: any) {
    this.toastService.info('Document Verification', `Verifying enrollment documents for ${enrollment.employeeName}...`);
    setTimeout(() => {
      this.toastService.success('Verification Complete', 'All required documents are valid and complete.');
    }, 2000);
  }

  approveEnrollment(enrollment: any) {
    this.pendingEnrollments = this.pendingEnrollments.filter(e => e.id !== enrollment.id);
    const monthlyCost = enrollment.monthlyPremium * enrollment.companyContribution / 100;
    this.toastService.success('Enrollment Approved', `${enrollment.policyType} approved for ${enrollment.employeeName}. Monthly cost: ₹${monthlyCost.toLocaleString()}`);
  }

  rejectEnrollment(enrollment: any) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.pendingEnrollments = this.pendingEnrollments.filter(e => e.id !== enrollment.id);
      this.toastService.warning('Enrollment Rejected', `${enrollment.policyType} rejected for ${enrollment.employeeName}. Reason: ${reason}`);
    }
  }
}