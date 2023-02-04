
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  isChangeByTyping = false;
  pageValue = this.apiQuery.page.value + 1;
  private unsubscribe: Subscription[] = [];

  constructor(
    public settings: AppSettingsService,
    public apiQuery: ApiQueryService,
  ) { }

  ngOnInit(): void {

    let ifPageChanged = this.apiQuery.page.subscribe(res => {
      if (!res) return
      this.pageValue = res + 1
    })
    this.unsubscribe.push(ifPageChanged);

  }



  valuechange(newValue: any) {
    
    let value = Number(newValue);
    if(value > this.apiQuery.totalPages.value + 1) return
    if (!value) return
    if (!Number(value)) return
    if (value <= 0) return
    
    if (value -1 == this.apiQuery.page.value) return
    this.apiQuery.page.next(value - 1)
    
    this.apiQuery.apply()

  }

  async limit(number: number) {
    if(!number) return
    this.apiQuery.resetApiKey(true)
    this.apiQuery.limit.next(number)
    await this.onPaginationChange();
  }

  async paginationPrevious() {
    if (this.apiQuery.page.value === 0) return;
    this.apiQuery.page.next(this.apiQuery.page.value - 1);
    this.onPaginationChange();
  }

  async paginationNext() {
    if (this.apiQuery.page.value === this.apiQuery.totalPages.value) return;
    this.apiQuery.page.next(this.apiQuery.page.value + 1);
    this.onPaginationChange();
  }

  onPaginationChange() {
    this.apiQuery.apply()
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }

}
