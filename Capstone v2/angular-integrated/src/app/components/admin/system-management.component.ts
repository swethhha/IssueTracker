import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>System Management</h1>
        <p>System configuration and management</p>
      </div>
      <div class="card">
        <div class="card-body">
          <p>System management functionality coming soon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
  `]
})
export class SystemManagementComponent {}