import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppSettingsService } from '../appSettings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ApiQueryService {

  isApply = new Subject()
  isReset = new Subject()
  
  isSearch: BehaviorSubject<any> = new BehaviorSubject(false)
  search: BehaviorSubject<string> = new BehaviorSubject("")
  fieldSearch: BehaviorSubject<string> = new BehaviorSubject("")
  
  status: BehaviorSubject<string> = new BehaviorSubject('all')
  hide: BehaviorSubject<string> = new BehaviorSubject('all')
  
  type: BehaviorSubject<string> = new BehaviorSubject('all')
  branch: BehaviorSubject<string> = new BehaviorSubject('all')

  start: BehaviorSubject<string> = new BehaviorSubject('all')
  end: BehaviorSubject<string> = new BehaviorSubject('all')

  limit: BehaviorSubject<number> = new BehaviorSubject(10)
  page: BehaviorSubject<number> = new BehaviorSubject(0)
  totalPages: BehaviorSubject<number> = new BehaviorSubject(0)
  
  sort: BehaviorSubject<string> = new BehaviorSubject('desc')
  
  mediaType: BehaviorSubject<string> = new BehaviorSubject('all')
  
  isShowSearch = new BehaviorSubject(false)

  constructor(
    private settings: AppSettingsService
  ) { }

  resetApiKey(isPreventApply:boolean = false) {
    
    if(this.settings.isContentLoading.value) return

    this.status.next('all')
    this.hide.next('all')
    this.type.next('all')
    this.branch.next('all')
    this.end.next('all')
    this.start.next('all')
  
    this.resetSearch()

    this.sort.next('desc')
    
    this.mediaType.next('all')

    this.isShowSearch.next(false)

    this.resetPagination()

    if(isPreventApply) return
    this.apply()
  }

  resetSearch(){
    this.search.next('')
    this.fieldSearch.next('')
    this.isSearch.next(false)

  }

  resetPagination(){
    if(this.settings.isContentLoading.value) return

    this.limit.next(10)
    this.page.next(0)
    this.totalPages.next(0)
  }

  getApiQuery() {
    let apiQuery = `?status=${this.status.value}&limit=${this.limit.value}&page=${this.page.value}&start=${this.start.value}&end=${this.end.value}&search=${this.search.value}`
    let sortQuery = `&sort=${this.sort.value}&hide=${this.hide.value}`
    let mediaQuery = `&type=${this.mediaType.value}`
    let userQuery = `&branch=${this.branch.value}`
    let accountantQuery = `&type=${this.type.value}`

    let query = {apiQuery, sortQuery, mediaQuery, userQuery, accountantQuery}
    return query
  }

  apply(isResetPage: boolean = false) {
    if(this.settings.isContentLoading.value) return

    if(isResetPage) {
      this.page.next(0)
    }

    this.isApply.next(true)
  }

}
