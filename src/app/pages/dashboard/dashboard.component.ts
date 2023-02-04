import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private route: Router, private role: RoleService) {
    if(!this.role.isSuperAdmin()) this.route.navigate(['dashboard-lite']);
    
  }

}
