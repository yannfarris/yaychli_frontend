import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private role: RoleService, private router: Router, private modal: ModalsService) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.role.isMegaAdmin()) return true;
      this.router.navigate(['/'])
      return false;
  }
  
}
