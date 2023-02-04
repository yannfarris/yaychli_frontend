import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-sort-filter',
  templateUrl: './sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss']
})
export class SortFilterComponent implements OnInit, OnDestroy {
  public form: any;
  private unsubscribe: Subscription[] = [];
  isRtl: boolean = false

  constructor(
    public settings: AppSettingsService,
    private formBuilder: FormBuilder,
    private apiQuery: ApiQueryService,
    public role:RoleService
  ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      sort: [this.apiQuery.sort.value],
    });

    let field = this.form.get('sort').valueChanges.pipe().subscribe((res: any) => {
      if (!res) return
      this.apiQuery.sort.next(res)
    })

    this.unsubscribe.push(field)

    let isReset = this.apiQuery.isReset.subscribe(res => {
      if (!res) return
      this.reset()
    })

    this.unsubscribe.push(isReset)

  }

  reset() {
    this.form.controls['sort'].setValue(this.apiQuery.sort.value)

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }


}
