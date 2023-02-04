  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { FormBuilder } from '@angular/forms';
  import { Subscription } from 'rxjs';
  import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
  import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
  
  @Component({
    selector: 'app-hide-old-filter',
    templateUrl: './hide-old-filter.component.html',
    styleUrls: ['./hide-old-filter.component.scss']
  })
  export class HideOldFilterComponent implements OnInit, OnDestroy {
    public form: any;
    private unsubscribe: Subscription[] = [];
    isRtl: boolean = false
  
    constructor(
      public settings: AppSettingsService,
      private formBuilder: FormBuilder,
      private apiQuery: ApiQueryService,
  
  
    ) { }
  
    ngOnInit(): void {
  
      this.form = this.formBuilder.group({
        hide: [this.apiQuery.hide.value],
      });
  
      let field = this.form.get('hide').valueChanges.pipe().subscribe((res: any) => {
        if (!res) return
        if(res === 'hide') return this.apiQuery.hide.next('hide')
        this.apiQuery.hide.next('all')
  
      })
  
      this.unsubscribe.push(field)
  
      let isReset = this.apiQuery.isReset.subscribe(res => {
  
        if (!res) return
        this.reset()
      })
  
      this.unsubscribe.push(isReset)
  
    }
  
    reset() {
      this.form.controls['hide'].setValue(this.apiQuery.hide.value)
  
    }
  
    ngOnDestroy(): void {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
  
    }
  
  }
  
