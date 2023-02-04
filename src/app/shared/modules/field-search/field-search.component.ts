import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';

@Component({
  selector: 'app-field-search',
  templateUrl: './field-search.component.html',
  styleUrls: ['./field-search.component.scss']
})
export class FieldSearchComponent implements OnInit, OnDestroy {
  isRtl: boolean = false
  form: any;

  private unsubscribe: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private apiQuery: ApiQueryService
  ) { }

  ngOnInit(): void {
    this.apiQuery.fieldSearch.next('')
    
    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }
    this.form = this.formBuilder.group({

      search: [this.apiQuery.fieldSearch.value],

    });

  }

  addNewSearch(value: any) {
    this.apiQuery.fieldSearch.next(value)
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.fieldSearch.next('')
  }

}
