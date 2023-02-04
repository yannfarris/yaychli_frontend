import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';

@Component({
  selector: 'app-accountant-type-filter',
  templateUrl: './accountant-type-filter.component.html',
  styleUrls: ['./accountant-type-filter.component.scss']
})
export class AccountantTypeFilterComponent implements OnInit, OnDestroy {


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
      type: [this.apiQuery.type.value],
    });

    let field = this.form.get('type').valueChanges.pipe().subscribe((res: any) => {
      if (!res) return
      this.apiQuery.type.next(res)

    })

    this.unsubscribe.push(field)

    let isReset = this.apiQuery.isReset.subscribe(res => {

      if (!res) return
      this.reset()
    })

    this.unsubscribe.push(isReset)

  }

  reset() {
    this.form.controls['type'].setValue(this.apiQuery.type.value)

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }


}
