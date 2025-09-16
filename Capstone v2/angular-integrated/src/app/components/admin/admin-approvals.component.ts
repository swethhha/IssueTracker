import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Admin Approvals</h1>
        <p>System-wide approval management</p>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Admin approval functionality coming soon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
  `]
})
export class AdminApprovalsComponent {}