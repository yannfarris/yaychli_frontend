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
    providedIn: 'root',
  })
  export class BusService {
    isNewData = new Subject();

    busType = [
      {type: 1, total:  38},
      {type: 2, total:  39},
      {type: 3, total:  41},
      {type: 4, total:  39},
      {type: 5, total:  36},
    ]

    constructor(
      private http: HttpClient,
      private settings: AppSettingsService,
      private modal: ModalsService,
      private auth: AuthService,
      private apiQuery: ApiQueryService,
      public dialog: MatDialog
    ) {}
  
    new(data: any) {
      let max_student =
        this.auth?.currentUserSubject?.value?.school?.max_students;
  
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
      const body = JSON.stringify(data);
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/bus`, body, { headers: headers })
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            this.modal.generalErrorMessageModal();
  
            return of(undefined);
          }),
  
          finalize(() =>
            this.settings.isLoading.next(this.settings.loadingInfo('off'))
          )
        );
    }
  
    getAllLite() {
      this.settings.isContentLoading.next(true);
  
      return this.http
        .get(`${this.settings.apiUrl}/bus/lite`)
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => this.settings.isContentLoading.next(false))
        );
    }
    getAll() {
      this.settings.isContentLoading.next(true);
  
      return this.http
        .get(
          `${this.settings.apiUrl}/bus${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}`
        )
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => this.settings.isContentLoading.next(false))
        );
    }
  
    delete(id: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      return this.http
        .delete(`${this.settings.apiUrl}/bus?id=${id}`)
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            this.modal.generalErrorMessageModal();
            return of(undefined);
          }),
  
          finalize(() =>
            this.settings.isLoading.next(this.settings.loadingInfo('off'))
          )
        );
    }
  
    changeStatus(id: string, state: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      const body = JSON.stringify({ id, state });
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/bus/status`, body, { headers: headers })
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            this.modal.generalErrorMessageModal();
            return of(undefined);
          }),
          finalize(() =>
            this.settings.isLoading.next(this.settings.loadingInfo('off'))
          )
        );
    }
  }
  