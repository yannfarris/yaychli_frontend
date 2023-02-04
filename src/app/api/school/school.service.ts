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
export class SchoolService {

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


    return this.http.post(`${this.settings.apiUrl}/schools`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if (err.error.type === 'max_students') {
            this.modal.generalErrorMessageModal('school.max_students_warn')
            return of(undefined);

          }

          if (err.error.type === 'emailNotValid') {

            this.modal.generalErrorMessageModal('auth.type_correct_email')
            return of(undefined);

          }
          this.modal.generalErrorMessageModal()

          return of(undefined);
        }),
        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  changeMaxStudent(fieldData: any) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify(fieldData)
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/schools/student/max`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if (err.error.type === 'max_students_is_less') {
            this.modal.generalErrorMessageModal('school.max_students_is_less')
            return of(undefined);

          }

          if (err.error.type === 'max_students') {
            this.modal.generalErrorMessageModal('school.max_students_warn3')
            return of(undefined);

          }

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  changeState(id: string, state:string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({id, state})
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/schools/state`, body, { headers: headers })

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

  changeMaxSize(fieldData: any) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify(fieldData)
    const headers = { 'content-type': 'application/json' };

    return this.http.post(`${this.settings.apiUrl}/schools/size/max`, body, { headers: headers })

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {

          if (err.error.type === 'max_size_less') {
            this.modal.generalErrorMessageModal('school.max_size_less')
            return of(undefined);

          }

          if (err.error.type === 'max_size_exce') {
            this.modal.generalErrorMessageModal('school.change_max_size2')
            return of(undefined);

          }

          this.modal.generalErrorMessageModal()
          return of(undefined);

        }),

        finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
      )
  }

  changeAdsStatus(id: string, state:string) {
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    const body = JSON.stringify({id, state})
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/schools/state/ads`, body, { headers: headers })

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

  changeDueDate(id: string, date:string) {
    this.settings.isLoading.next(this.settings.loadingInfo('off'))

    const body = JSON.stringify({id, date})
    const headers = { 'content-type': 'application/json' };


    return this.http.post(`${this.settings.apiUrl}/schools/date`, body, { headers: headers })

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

    return this.http.delete(`${this.settings.apiUrl}/schools?id=${id}`)

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

    return this.http.get(`${this.settings.apiUrl}/schools${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}`)

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
