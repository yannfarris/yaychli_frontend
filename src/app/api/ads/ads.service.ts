import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class AdsService {

  adsCount = 0;

  constructor(

    private http: HttpClient,
    private settings: AppSettingsService,
    private router: Router,
    private modal: ModalsService,
    private translation: TranslationService,
    private auth: AuthService,
    private apiQuery: ApiQueryService

  ) { }

  new(data: any, isLoading:boolean = true) {

    if(isLoading){
      this.settings.isLoading.next(this.settings.loadingInfo('on'))
    }

    const body = JSON.stringify(data)
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/ads`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          
          if(err.error.type === 'maxAdsExc'){
            this.modal.generalErrorMessageModal('general.max_ads');
            return of(undefined);
          }

          
          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  changeState(id: string, currentState:string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({id, state: currentState})
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/ads/status`, body, { headers: headers })

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

  delete(id:string){
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.delete(`${this.settings.apiUrl}/ads?id=${id}`)

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

  getAll(isLoading:boolean = true) {

    if(isLoading) {
      this.settings.isContentLoading.next(true)
    }

    return this.http.get(`${this.settings.apiUrl}/ads${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          return of(undefined);
        }),

        finalize(() => this.settings.isContentLoading.next(false))
      )
  }

}
