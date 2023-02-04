import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ModalsService } from '../../services/modals/modals.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetInfoCheckGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService,private modal: ModalsService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let m = route.queryParams.m
    let tk = route.queryParams.tk

    if (!m || !tk) {
      this.router.navigate(['/']);
      return false;
    }

    return this.authService.passwordParamsCheck(m, tk).pipe(

      switchMap(res => {
        return of(true)
      }),

      catchError(error => {
        this.router.navigate(['/'])
        this.modal.generalErrorMessageModal('auth.reset_password_link_invalid')
        return of(false)
      })
    )
  }

}
