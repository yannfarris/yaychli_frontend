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
export class UserService {


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

  new(data: any) {
    let max_student = this.auth?.currentUserSubject?.value?.school?.max_students
    
    if (max_student <= 0 && data?.account_type === 'student') {
      this.modal.generalErrorMessageModal('user.max_user')
      return of(undefined);
    }

    this.settings.isLoading.next(this.settings.loadingInfo('on'))
    const body = JSON.stringify(data)
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/user`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if (err.error.type === 'emailExist') {

            this.modal.generalErrorMessageModal('error.emailExist')
            return of(undefined);

          }

          if (err.error.type === 'emailNotValid') {

            this.modal.generalErrorMessageModal('error.type_correct_email')
            return of(undefined);

          }
          if (err.error.type === 'password_weak') {

            this.modal.generalErrorMessageModal('passwordWeek')
            return of(undefined);

          }

          if (err.error.isAuth === false) {

            this.dialog.closeAll()

            return of(undefined);

          }

          this.modal.generalErrorMessageModal()

          return of(undefined);
        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  getAll() {
    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/user${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => this.settings.isContentLoading.next(false))
      )
  }
  
  delete(id: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.delete(`${this.settings.apiUrl}/user?id=${id}`)

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

  changeProfileImage(mediaArr: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ mediaArr })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/media/profile/image`, body, { headers: headers })

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
  changeStatus(id: string, state: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ id, state })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/user/status`, body, { headers: headers })

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
  changeName(id: string, value: string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({ id, value })
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/user/name`, body, { headers: headers })

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
            this.modal.generalErrorMessageModal('error.type_correct_email')
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
            this.modal.generalErrorMessageModal('passwordWeek')
            return of(undefined);
          }

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

}
