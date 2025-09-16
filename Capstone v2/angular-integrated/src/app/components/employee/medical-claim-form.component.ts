import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceGuardService } from '../../services/insurance-guard.service';

@Component({
  selector: 'app-medical-claim-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="!hasAccess" style="padding: 40px; text-align: center; background: #fef2f2; border-radius: 12px; margin: 20px;">
      <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
      <h2 style="color: #dc2626; margin-bottom: 15px;">Access Restricted</h2>
      <p style="color: #7f1d1d; margin-bottom: 20px;">
        You must be enrolled in at least one insurance policy to access medical claims.
      </p>
      <button (click)="goToInsurance()" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
        Enroll in Insurance
      </button>
    </div>

    <div *ngIf="hasAccess" style="padding: 20px; width: 100%; margin: 0;">
      <h2>Medical Claim Form</h2>
      <p>Submit your medical claim for reimbursement under your insurance policy.</p>
      
      <!-- Required Documents Section -->
      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #92400e; margin-bottom: 15px;">📋 Required Documents Checklist</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="color: #92400e; font-size: 14px;">✓ Original hospital bills/receipts</div>
          <div style="color: #92400e; font-size: 14px;">✓ Discharge summary</div>
          <div style="color: #92400e; font-size: 14px;">✓ Doctor's prescription</div>
          <div style="color: #92400e; font-size: 14px;">✓ Diagnostic test reports</div>
          <div style="color: #92400e; font-size: 14px;">✓ Payment receipts</div>
          <div style="color: #92400e; font-size: 14px;">✓ Insurance card copy</div>
        </div>
        <p style="color: #92400e; font-size: 12px; margin-top: 10px; margin-bottom: 0;">All documents must be clear and legible. Accepted formats: PDF, JPG, PNG</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <form (ngSubmit)="onSubmit()" #claimForm="ngForm">
          <!-- Patient Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Patient Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Patient Name *</label>
                <input type="text" [(ngModel)]="claimData.patientName" name="patientName" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Relationship to Employee *</label>
                <select [(ngModel)]="claimData.relationship" name="relationship" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                  <option value="">Select Relationship</option>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Patient Age *</label>
                <input type="number" [(ngModel)]="claimData.patientAge" name="patientAge" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Contact Number *</label>
                <input type="tel" [(ngModel)]="claimData.contactNumber" name="contactNumber" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
            </div>
          </div>

          <!-- Treatment Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Treatment Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Treatment Date *</label>
                <input type="date" [(ngModel)]="claimData.treatmentDate" name="treatmentDate" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Discharge Date</label>
                <input type="date" [(ngModel)]="claimData.dischargeDate" name="dischargeDate" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Hospital/Clinic Name *</label>
              <input type="text" [(ngModel)]="claimData.hospitalName" name="hospitalName" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Doctor Name *</label>
                <input type="text" [(ngModel)]="claimData.doctorName" name="doctorName" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Treatment Type *</label>
                <select [(ngModel)]="claimData.treatmentType" name="treatmentType" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                  <option value="">Select Treatment Type</option>
                  <option value="Hospitalization">Hospitalization</option>
                  <option value="Day Care">Day Care Procedure</option>
                  <option value="Emergency">Emergency Treatment</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Maternity">Maternity</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Diagnosis/Reason for Treatment *</label>
              <textarea [(ngModel)]="claimData.diagnosis" name="diagnosis" required rows="3" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; resize: vertical;"></textarea>
            </div>
          </div>

          <!-- Financial Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Financial Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Total Claim Amount *</label>
                <input type="number" [(ngModel)]="claimData.claimAmount" name="claimAmount" required min="0" step="0.01" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Amount Paid by You *</label>
                <input type="number" [(ngModel)]="claimData.paidAmount" name="paidAmount" required min="0" step="0.01" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              </div>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Bank Account Details for Reimbursement *</label>
              <input type="text" [(ngModel)]="claimData.bankAccount" name="bankAccount" required placeholder="Account Number - IFSC Code" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
            </div>
          </div>

          <!-- Document Upload -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Document Upload</h3>
            
            <div style="border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 15px;">
              <input type="file" (change)="onFileSelect($event)" multiple accept=".pdf,.jpg,.jpeg,.png" style="margin-bottom: 10px;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">Upload all required documents (PDF, JPG, PNG)</p>
            </div>
            
            <div *ngIf="selectedFiles.length > 0" style="margin-top: 15px;">
              <h4 style="color: #374151; margin-bottom: 10px;">Selected Files:</h4>
              <div *ngFor="let file of selectedFiles" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f8fafc; border-radius: 6px; margin-bottom: 5px;">
                <span style="color: #64748b; font-size: 14px;">{{ file.name }}</span>
                <button type="button" (click)="removeFile(file)" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div style="margin-bottom: 30px; background: #f0f9ff; padding: 20px; border-radius: 8px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
              <input type="checkbox" [(ngModel)]="claimData.declaration" name="declaration" required style="margin-top: 2px;">
              <span style="color: #374151; font-size: 14px; line-height: 1.5;">
                I hereby declare that the information provided above is true and correct to the best of my knowledge. 
                I understand that any false information may result in rejection of my claim. I authorize the insurance 
                company to verify the details provided and process my claim accordingly.
              </span>
            </label>
          </div>
          
          <div style="display: flex; gap: 15px; justify-content: flex-end;">
            <button type="button" style="background: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
              Save as Draft
            </button>
            <button type="submit" [disabled]="!claimForm.form.valid || selectedFiles.length === 0" [style.background]="claimForm.form.valid && selectedFiles.length > 0 ? '#10b981' : '#9ca3af'" style="color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MedicalClaimFormComponent implements OnInit {
  hasAccess = false;
  selectedFiles: File[] = [];
  
  claimData = {
    patientName: '',
    relationship: '',
    patientAge: '',
    contactNumber: '',
    treatmentDate: '',
    dischargeDate: '',
    hospitalName: '',
    doctorName: '',
    treatmentType: '',
    diagnosis: '',
    claimAmount: '',
    paidAmount: '',
    bankAccount: '',
    declaration: false
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.hasAccess = InsuranceGuardService.hasActiveInsurance();
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onSubmit() {
    if (this.selectedFiles.length === 0) {
      alert('Please upload at least one document to submit your claim.');
      return;
    }
    
    alert('Medical claim submitted successfully! You will receive a confirmation email shortly.');
    this.router.navigate(['/employee/medical-claims']);
  }

  goToInsurance() {
    this.router.navigate(['/employee/insurance']);
  }
}