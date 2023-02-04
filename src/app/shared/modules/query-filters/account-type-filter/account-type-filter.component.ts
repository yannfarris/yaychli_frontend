import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { BranchService } from 'src/app/api/branch/branch.service';

@Component({
  selector: 'app-account-type-filter',
  templateUrl: './account-type-filter.component.html',
  styleUrls: ['./account-type-filter.component.scss']
})
export class AccountTypeFilterComponent implements OnInit, OnDestroy {

  public form: any;
  private unsubscribe: Subscription[] = [];
  isRtl: boolean = false
  branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    public settings: AppSettingsService,
    private formBuilder: FormBuilder,
    private apiQuery: ApiQueryService,
    private branch: BranchService


  ) { }

  ngOnInit(): void {

    this.getBranchs()

    this.form = this.formBuilder.group({
      type: [this.apiQuery.type.value],
    });

    let field = this.form.get('type').valueChanges.pipe().subscribe((res: any) => {
      if (!res) return
      this.apiQuery.branch.next(res)

    })

    this.unsubscribe.push(field)

    let isReset = this.apiQuery.isReset.subscribe(res => {

      if (!res) return
      this.reset()
    })

    this.unsubscribe.push(isReset)

  }

  reset() {
    this.form.controls['type'].setValue(this.apiQuery.branch.value)

  }

  getBranchs() {

    this.branch.getAllLite().subscribe(async (res:any) => {
      if (!res) return;
      this.branches.next(res)
    
  })

}

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }


}
