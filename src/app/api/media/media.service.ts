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
export class MediaService {
  
  files: File[] = [];
  maxFile = 10;
  allowedType = 'any';
  isShowSearch = new BehaviorSubject(false)
  isneMediaInfo = new BehaviorSubject(false)

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

  reset() {
    this.files = [];
    this.maxFile = 10;
    this.allowedType = 'any'
  }


  isImage(type: any) {
    if (type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return true;
    return false;
  }

  isPdf(type: any) {
    if (type.includes('pdf')) return true;
    return false;
  }

  new() {

    let data = this.files

    if (data.length <= 0) return of({ isImage: false });

    this.settings.isLoading.next(this.settings.loadingInfo('on'));

    let formData = new FormData();

    data.forEach((element: any) => {
      formData.append('file', element);
    });

    return this.http.post(`${this.settings.apiUrl}/media/upload`, formData).pipe(

      take(1),
      shareReplay(),
      catchError((err) => {
        
        if (err.error.type === 'maxMediaExc') {
          this.modal.generalErrorMessageModal('media.max_size_reached')
          return of(undefined);

        }

        this.modal.generalErrorMessageModal()
        return of(undefined);

      }),

      finalize(() => this.settings.isLoading.next(this.settings.loadingInfo('off')))
    )

  }

  getMediaInfo() {

    return this.http.get(`${this.settings.apiUrl}/media/info`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          this.modal.generalErrorMessageModal()
          return of(undefined);
        })
      )
  }
  getAll() {

    this.settings.isContentLoading.next(true)

    return this.http.get(`${this.settings.apiUrl}/media${this.apiQuery.getApiQuery().apiQuery}${this.apiQuery.getApiQuery().sortQuery}${this.apiQuery.getApiQuery().mediaQuery}`)

      .pipe(
        take(1),
        shareReplay(),
        catchError((err) => {
          this.modal.generalErrorMessageModal()
          return of(undefined);
        }),
        finalize(() => this.settings.isContentLoading.next(false))
      )
  }


  delete(id:string, type = ""){
    this.settings.isLoading.next(this.settings.loadingInfo('on'))

    return this.http.delete(`${this.settings.apiUrl}/media?id=${id}`)

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
