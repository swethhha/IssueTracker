import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-apply',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Apply for Loan</h1>
      <div class="card">
        <h3>Loan Application</h3>
        <p>Submit your loan application here.</p>
      </div>
    </div>
  `
})
export class LoanApplyComponent {}