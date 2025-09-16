import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Insurance Policies</h1>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
        
        <div style="border: 2px solid blue; padding: 20px; border-radius: 10px; background: white;">
          <h2>🏥 Group Mediclaim</h2>
          <p><strong>Coverage:</strong> ₹4 Lakhs Family Floater</p>
          <p><strong>Premium:</strong> Employee FREE, Spouse ₹1,816/year</p>
          <ul>
            <li>✓ Pre & Post Hospitalization</li>
            <li>✓ Day Care Procedures</li>
            <li>✓ Maternity Benefits</li>
            <li>✓ No Waiting Period</li>
          </ul>
          <button style="background: blue; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            Enroll Now
          </button>
        </div>

        <div style="border: 1px solid gray; padding: 20px; border-radius: 10px; background: white;">
          <h2>🛡️ Term Life Insurance</h2>
          <p><strong>Coverage:</strong> ₹50 Lakhs Individual</p>
          <p><strong>Premium:</strong> ₹8,500-₹18,500/year (50% company paid)</p>
          <ul>
            <li>✓ Death Benefit</li>
            <li>✓ Accidental Death (2x)</li>
            <li>✓ Terminal Illness</li>
            <li>✓ Tax Benefits</li>
          </ul>
          <button style="background: green; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            Enroll Now
          </button>
        </div>

        <div style="border: 1px solid gray; padding: 20px; border-radius: 10px; background: white;">
          <h2>🚑 Personal Accident</h2>
          <p><strong>Coverage:</strong> ₹10 Lakhs Individual + Family</p>
          <p><strong>Premium:</strong> ₹2,500/year (100% company paid)</p>
          <ul>
            <li>✓ Accidental Death</li>
            <li>✓ Permanent Disability</li>
            <li>✓ Medical Expenses</li>
            <li>✓ Worldwide Coverage</li>
          </ul>
          <button style="background: orange; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            Enroll Now
          </button>
        </div>

        <div style="border: 1px solid gray; padding: 20px; border-radius: 10px; background: white;">
          <h2>💊 Critical Illness</h2>
          <p><strong>Coverage:</strong> ₹25 Lakhs Individual</p>
          <p><strong>Premium:</strong> ₹15,000-₹25,000/year (70% company paid)</p>
          <ul>
            <li>✓ Cancer (All Stages)</li>
            <li>✓ Heart Attack</li>
            <li>✓ Stroke</li>
            <li>✓ 36+ Critical Illnesses</li>
          </ul>
          <button style="background: purple; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            Enroll Now
          </button>
        </div>

      </div>
    </div>
  `
})
export class InsuranceListComponent {}