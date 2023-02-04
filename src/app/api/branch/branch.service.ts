import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, of, Subject } from 'rxjs';
import { finalize, shareReplay, take } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
@Injectable({
  providedIn: 'root'
})
export class BranchService {


  isNewData = new Subject()
  constructor(

    private http: HttpClient,
    private settings: AppSettingsService,
    private modal: ModalsService,
    private auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,

  ) { }

  new(data: any) {
    let max_student = this.auth?.currentUserSubject?.value?.school?.max_students
    
    this.settings.isLoading.next(this.settings.loadingInfo('on'))
    const body = JSON.stringify(data)
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/branch`, body, { headers: headers })

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

  getAllLite() {
    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/branch/lite`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => this.settings.isContentLoading.next(false))
      )
  }
  getAll() {
    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/branch${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}`)

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

    return this.http.delete(`${this.settings.apiUrl}/branch?id=${id}`)

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

    return this.http.post(`${this.settings.apiUrl}/branch/status`, body, { headers: headers })

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
  

}
