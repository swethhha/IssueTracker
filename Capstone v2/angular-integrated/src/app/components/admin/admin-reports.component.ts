import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Admin Reports</h1>
        <p>System-wide reporting and analytics</p>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Admin reporting functionality coming soon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
  `]
})
export class AdminReportsComponent {}