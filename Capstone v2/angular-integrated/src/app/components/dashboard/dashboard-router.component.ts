import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-router',
  standalone: true,
  template: '<div>Loading...</div>'
})
export class DashboardRouterComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const role = this.auth.userRole;
    switch(role) {
      case 'Manager':
        this.router.navigate(['/dashboard/manager']);
        break;
      case 'FinanceAdmin':
        this.router.navigate(['/dashboard/finance']);
        break;
      default:
        this.router.navigate(['/dashboard/employee']);
    }
  }
}