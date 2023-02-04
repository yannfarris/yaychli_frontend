import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';

@Injectable({
  providedIn: 'root'
})
export class IsShowDashboardGuard implements CanActivate {
  constructor(private role: RoleService, private router: Router, private modal: ModalsService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
       this.router.navigate(['/trips'])
       return false;
      if(this.role.isEmployeeOnly()) {
        this.router.navigate(['trips'])
        return false;
      }

    return true;
  }
  
}
