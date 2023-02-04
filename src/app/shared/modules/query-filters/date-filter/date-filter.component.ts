import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit, OnDestroy {

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
      start: [this.apiQuery.start.value],
      end: [this.apiQuery.end.value],
    });

    let field = this.form.get('start').valueChanges.pipe().subscribe((res: any) => {
      if (!res) return
      this.apiQuery.start.next(res)

    })

    this.unsubscribe.push(field)
    let field2 = this.form.get('end').valueChanges.pipe().subscribe((res: any) => {
      if (!res) return
      this.apiQuery.end.next(res)

    })

    this.unsubscribe.push(field2)

    let isReset = this.apiQuery.isReset.subscribe(res => {
      if (!res) return
      this.reset()
    })

    this.unsubscribe.push(isReset)


  }

  reset() {
    this.form.controls['start'].setValue(this.apiQuery.start.value)
    this.form.controls['end'].setValue('all')
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }

}
