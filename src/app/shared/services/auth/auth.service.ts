import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { finalize, shareReplay, take } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n';
import { AppSettingsService } from '../appSettings/app-settings.service';
import { ModalsService } from '../modals/modals.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoadingSubject: BehaviorSubject<boolean>;
  currentUser$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any>;
  passwordForgetSent: BehaviorSubject<any> = new BehaviorSubject(false)

  constructor(
    private http: HttpClient,
    private settings: AppSettingsService,
    private router: Router,
    private modal: ModalsService,
    private translation: TranslationService,
  ) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();

  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    this.isLoadingSubject.next(true);

    let data = {
      email: email,
      password: password,
    }

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(`${this.settings.apiUrl}/auth/login`, body, { 'headers': headers })
      .pipe(
        take(1),
        shareReplay(),

        map((auth: any) => {
          localStorage.setItem('accessToken', auth.accessToken)
          return auth.accessToken;
        }),

        switchMap(() => this.getUserByToken()),

        catchError((err) => {
          return of(err);
        }),

        finalize(() => this.isLoadingSubject.next(false),

        ))

  }
  forgetPassword(email: string) {
    this.isLoadingSubject.next(true);
    let lang = this.translation.getSelectedLanguage() || 'en'

    let data = {
      email: email,
      lang
    }

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(`${this.settings.apiUrl}/auth/password-reset`, body, { 'headers': headers })
      .pipe(
        take(1),
        shareReplay(),

        map((auth: any) => {
          return auth;
        }),

        catchError((err) => {
          if (err.error.type === 'invalidEmail') {

            this.modal.generalErrorMessageModal('auth.type_correct_email')
            return of(undefined)
          }
          this.modal.generalErrorMessageModal()

          return of(undefined);
        }),

        finalize(() => this.afterPasswordReset(),

        ))

  }
  newPassword(password: string, m: string, tk: string) {
    this.isLoadingSubject.next(true);

    let data = { password, m, tk }

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(`${this.settings.apiUrl}/auth/new-password`, body, { 'headers': headers })
      .pipe(
        take(1),
        shareReplay(),

        map((auth: any) => {
          return auth;
        }),

        catchError((err) => {
          console.error('err', err);

          if (err.error.type === 'oldPasswordIdentical') {
            this.modal.generalErrorMessageModal('auth.old_password_identical')
          }

          return of(undefined);
        }),

        finalize(() => this.isLoadingSubject.next(false),

        ))

  }

  afterPasswordReset() {
    this.isLoadingSubject.next(false)
    this.passwordForgetSent.next(true)
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  passwordParamsCheck(m: string, tk: string) {

    let data = { m, tk }

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(`${this.settings.apiUrl}/auth/password-reset-params`, body, { 'headers': headers })
      .pipe(
        take(1),
        shareReplay(),
      )

  }

  serverUserAuthCheck(token: string) {

    this.isLoadingSubject.next(true);

    let data = {
      token: token,
    }

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(`${this.settings.apiUrl}/auth/user-auth`, body, { 'headers': headers })
      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          this.modal.generalErrorMessageModal()
          return of(undefined);
        }),

      )

  }

  getUserByToken(): Observable<any> {
    const auth = localStorage.getItem('accessToken')

    if (!auth) {
      // location.reload()
      return of(undefined);
    }


    this.isLoadingSubject.next(true);

    return this.serverUserAuthCheck(auth).pipe(

      take(1),
      map((user: any) => {

        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),

      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
