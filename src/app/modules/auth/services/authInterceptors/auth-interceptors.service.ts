import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorsService {

  constructor(private modal: ModalsService, private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = localStorage.getItem('accessToken')
    

    if (token != null && token != undefined) {

      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      // req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    }

    return next.handle(req).pipe(
      catchError((error) => {

        if(error.error.isAuth == false){

          this.authService.logout();
          return throwError(error);

        }

        if(error.error.isActive == false){
          this.modal.generalErrorMessageModal('auth.exp_school_account')
          this.authService.logout();
          return throwError(error);

        }
        if(error.error.status == 401 || error.error.status == 403){

          this.router.navigate(['/'])
        }
        return throwError(error);
    })

    );
  }
}
