import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { finalize, shareReplay, take } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

@Injectable({
  providedIn: 'root'
})
export class PosService {



  isNewData = new Subject()
  constructor(

    private http: HttpClient,
    private settings: AppSettingsService,
    private router: Router,
    private modal: ModalsService,
    private translation: TranslationService,
    private auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,


  ) { }

  newProduct(data: any) {

    this.settings.isLoading.next(this.settings.loadingInfo('on'))
    const body = JSON.stringify(data)
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/pos/product`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          this.modal.generalErrorMessageModal()

          return of(undefined);
        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }
  newInvoice(data: any) {

    this.settings.isLoading.next(this.settings.loadingInfo('on'))
    const body = JSON.stringify(data)
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/pos/invoice`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          this.modal.generalErrorMessageModal()

          return of(undefined);
        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  getAllProduct(pos_status = 'any') {
    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/pos/product${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}&pos_status=${pos_status}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => this.settings.isContentLoading.next(false))
      )
  }
  getAllInvoices() {
    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/pos/invoice${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => this.settings.isContentLoading.next(false))
      )
  }

  getUserInfo(id: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.get(`${this.settings.apiUrl}/pos/user/info?id=${id}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if(err.error.type === 'noUser'){
            this.modal.generalErrorMessageModal('attendance.user_do_not_exist')
            return of(undefined);
          }
          if(err.error.type === 'notStudent'){
            this.modal.generalErrorMessageModal('pos.not_user')
            return of(undefined);
          }

          return of(undefined);
        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))

      )
  }
  
  deleteInvoice(id: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.delete(`${this.settings.apiUrl}/pos/invoice?id=${id}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          this.modal.generalErrorMessageModal()
          return of(undefined);
        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )

  }
  
  deleteProduct(id: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.delete(`${this.settings.apiUrl}/pos/product?id=${id}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          this.modal.generalErrorMessageModal()
          return of(undefined);
        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )

  }

  changeProductStatus(id: string, state: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ id, state })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/pos/product/state`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  changeEmail(id: string, value: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ id, value })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/user/email`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if(err.error.type === 'emailNotValid'){
            this.modal.generalErrorMessageModal('auth.type_correct_email')
            return of(undefined);
          }
          if(err.error.type === 'emailExist'){
            this.modal.generalErrorMessageModal('error.emailExist')
            return of(undefined);
          }

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }
  changePassword(id: string, value: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ id, value })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/user/password`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          
          if(err.error.type === 'passwordWeek'){
            this.modal.generalErrorMessageModal('user.passwordWeek')
            return of(undefined);
          }

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

}
