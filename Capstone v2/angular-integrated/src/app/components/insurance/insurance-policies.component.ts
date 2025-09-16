import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-policies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Insurance Policies</h1>
      <div class="card">
        <h3>Your Insurance Coverage</h3>
        <p>View and manage your insurance policies here.</p>
      </div>
    </div>
  `
})
export class InsurancePoliciesComponent {}