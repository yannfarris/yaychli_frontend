import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, debounceTime, Subscription, take } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { NewSchoolComponent } from 'src/app/pages/schools/new-school/new-school.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { SchoolService } from 'src/app/api/school/school.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { NewUserComponent } from 'src/app/pages/user/new-user/new-user.component';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss']
})
export class SchoolsComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    public settings: AppSettingsService,
    public dialog: MatDialog,
    private auth: AuthService,
    private modal: ModalsService,
    private school: SchoolService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService

  ) { }

  ngOnInit(): void {

    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'schools'))

    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'schools') return;
      this.getData()
    })

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;

      if (Number(this.auth.currentUserSubject.value.max_students) === 0)
        return this.modal.generalErrorMessageModal('school.max_students_warn2')

      const dialogRef = this.dialog.open(NewSchoolComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe(user => {
        if (!user.id) return;
        this.newUser(user.id)
      })


    })

    this.unsubscribe.push(toolbarCreateSubject);
  }


  newUser(id: string) {

    const dialogRef = this.dialog.open(NewUserComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { school_id: id }

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.id !== 'done') return;
      this.modal.generalSuccessMessageModal('general.create_succes')
    });

  }

  async schoolDaysCal(startDate: any, dueDate: any) {

    const oneDay = 24 * 60 * 60 * 1000;

    let getStartDate = Date.parse(startDate)
    let getDueDate = Date.parse(dueDate)
    let currentDate = new Date().getTime()

    let usedDays = Math.round(Math.abs(getStartDate - currentDate) / oneDay);
    let daysLeft = Math.round(Math.abs(getDueDate - currentDate) / oneDay);
    let persent = Math.round(usedDays / daysLeft * 100);

    let daysInfo = {
      used_days: usedDays,
      days_left: daysLeft,
      persent: persent
    }
    return daysInfo;

  }

  async editData(data: any) {
    let newData = data

    await newData.forEach(async (element: any) => {

      let daysInfo = await this.schoolDaysCal(element.start_date, element.due_date)

      element['days_left'] = await Number(daysInfo.days_left)
      element['remaining_days'] = Number(Math.abs(daysInfo.used_days - daysInfo.days_left))
      element['remaining_days_persent'] = Number(daysInfo.persent)
      element['used_days'] = Number(daysInfo.used_days)

    });

    return newData
  }

  async getData() {

    let data = this.school.getAll().subscribe(async (res: any) => {
      if (!res) return;

      let data = await this.editData(res.content)
      this.items.next(data)
      if (res.content.length <= 0) return this.apiQuery.resetPagination()

      this.apiQuery.totalPages.next(res.count - 1)
    })

    this.unsubscribe.push(data);

  }

  getStatus(item: any) {

    if (item.status === 'active') {
      return this.translate.instant('general.active')
    }
    if (item.status === 'inactive') {
      return this.translate.instant('general.inactive')
    }
    if (item.status === 'sub_end') {
      return this.translate.instant('general.sub_ended')
    }
    return item.status;

  }
  getStatusColor(item: any) {

    if (item.status === 'active') {
      return 'success'
    }
    if (item.status === 'inactive') {
      return 'danger'
    }
    if (item.status === 'sub_end') {
      return 'danger'
    }
    return 'primary';

  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }


}
