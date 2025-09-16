import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Payroll Information</h1>
      <div class="card">
        <h3>Your Payroll Records</h3>
        <p>View and manage your payroll information here.</p>
      </div>
    </div>
  `
})
export class PayrollListComponent {}