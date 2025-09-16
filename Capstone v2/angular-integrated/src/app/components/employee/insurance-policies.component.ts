import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-policies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <h2 style="text-align: center; margin-bottom: 30px;">Insurance Policies</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        
        <!-- Group Mediclaim -->
        <div style="background: white; border: 2px solid #2563eb; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 40px;">🏥</div>
            <div>
              <h3 style="margin: 0; color: #1e293b;">Group Mediclaim</h3>
              <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 12px; font-size: 12px;">MOST POPULAR</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">₹4 Lakhs</div>
            <div style="color: #64748b;">Family Floater</div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">COVERAGE</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">✓ Employee, Spouse, Children</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Pre & Post Hospitalization</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Day Care Procedures</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Maternity: ₹50K/₹75K</li>
            </ul>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">PREMIUM</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">Employee: FREE</li>
              <li style="color: #64748b; margin-bottom: 5px;">Spouse: ₹1,816/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Child: ₹1,816/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Parent: ₹4,363/year</li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button style="flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
              Enroll Now
            </button>
            <button style="flex: 1; background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 12px; border-radius: 8px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>

        <!-- Term Life Insurance -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 40px;">🛡️</div>
            <div>
              <h3 style="margin: 0; color: #1e293b;">Term Life Insurance</h3>
              <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px;">NEW</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">₹50 Lakhs</div>
            <div style="color: #64748b;">Individual</div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">COVERAGE</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">✓ Death Benefit</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Accidental Death (2x)</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Terminal Illness</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Permanent Disability</li>
            </ul>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">PREMIUM</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">Age 25-30: ₹8,500/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Age 31-35: ₹12,000/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Company Share: 50%</li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button style="flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
              Enroll Now
            </button>
            <button style="flex: 1; background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 12px; border-radius: 8px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>

        <!-- Personal Accident -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 40px;">🚑</div>
            <div>
              <h3 style="margin: 0; color: #1e293b;">Personal Accident</h3>
              <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px;">ESSENTIAL</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">₹10 Lakhs</div>
            <div style="color: #64748b;">Individual + Family</div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">COVERAGE</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">✓ Accidental Death</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Permanent Disability</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Temporary Disability</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Medical Expenses</li>
            </ul>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">PREMIUM</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">Employee: ₹2,500/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Company Pays: 100%</li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button style="flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
              Enroll Now
            </button>
            <button style="flex: 1; background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 12px; border-radius: 8px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>

        <!-- Critical Illness -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 40px;">💊</div>
            <div>
              <h3 style="margin: 0; color: #1e293b;">Critical Illness</h3>
              <span style="background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 12px; font-size: 12px;">COMPREHENSIVE</span>
            </div>
          </div>
          
          <div style="text-align: center; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">₹25 Lakhs</div>
            <div style="color: #64748b;">Individual</div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">COVERED ILLNESSES</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">✓ Cancer (All Stages)</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Heart Attack</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ Stroke</li>
              <li style="color: #64748b; margin-bottom: 5px;">✓ 36+ Critical Illnesses</li>
            </ul>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; color: #374151; margin-bottom: 10px;">PREMIUM</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="color: #64748b; margin-bottom: 5px;">Age 25-35: ₹15,000/year</li>
              <li style="color: #64748b; margin-bottom: 5px;">Company Share: 70%</li>
            </ul>
          </div>

          <div style="display: flex; gap: 10px;">
            <button style="flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
              Enroll Now
            </button>
            <button style="flex: 1; background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 12px; border-radius: 8px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class InsurancePoliciesComponent {}