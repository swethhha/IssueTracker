import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reimbursement-submit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Submit Expense Claim</h1>
      <div class="card">
        <h3>Reimbursement Request</h3>
        <p>Submit your expense claims here.</p>
      </div>
    </div>
  `
})
export class ReimbursementSubmitComponent {}