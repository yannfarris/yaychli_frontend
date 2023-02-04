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
  export class TripsService {
    isNewData = new Subject();
    constructor(
      private http: HttpClient,
      private settings: AppSettingsService,
      private modal: ModalsService,
      private auth: AuthService,
      private apiQuery: ApiQueryService,
      public dialog: MatDialog
    ) {}
  
    newRev(data: any) {

  
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
      const body = JSON.stringify(data);
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/trip/rev`, body, { headers: headers })
  
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
    new(data: any) {
  
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
      const body = JSON.stringify(data);
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/trip`, body, { headers: headers })
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {

            if (err.error.type === 'date_pass') {

              this.modal.generalErrorMessageModal('date_pass')
              return of(undefined)
            }

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
        .get(`${this.settings.apiUrl}/trip/lite`)
  
        .pipe(
          take(1),
          shareReplay(),
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => this.settings.isContentLoading.next(false))
        );
    }

    getRevs(id: string = '') {
      this.settings.isContentLoading.next(true);
  
      return this.http
        .get(
          `${this.settings.apiUrl}/trip/revs?id=${id}`
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
    getAll() {
      this.settings.isContentLoading.next(true);
  
      return this.http
        .get(
          `${this.settings.apiUrl}/trip${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().userQuery}`
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
  
    deleteRev(id: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      return this.http
        .delete(`${this.settings.apiUrl}/trip/rev?id=${id}`)
  
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
  
    delete(id: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      return this.http
        .delete(`${this.settings.apiUrl}/trip?id=${id}`)
  
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
        .post(`${this.settings.apiUrl}/trip/status`, body, { headers: headers })
  
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
    changeRevStatus(id: string, state: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      const body = JSON.stringify({ id, state });
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/trip/rev/status`, body, { headers: headers })
  
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
    changeSeat(id: string, seat: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      const body = JSON.stringify({ id, seat });
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/trip/rev/seat`, body, { headers: headers })
  
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

    customer(id: string) {
      this.settings.isLoading.next(this.settings.loadingInfo('on'));
  
      const body = JSON.stringify({ id });
      const headers = { 'content-type': 'application/json' };
  
      return this.http
        .post(`${this.settings.apiUrl}/trip/rev/customer`, body, { headers: headers })
  
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
  