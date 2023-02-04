import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AttendanceService } from 'src/app/api/attendance/attendance.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { NewAttendanceComponent } from './new-attendance/new-attendance.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  sort = ['user.name' ,'user_type', 'user.email', 'type', 'guard_name','createdAt','createdAt', 'note'];

  rows = [
    this.translate.instant('general.name'),
    this.translate.instant('user.account_type'),
    this.translate.instant('general.email'),
    this.translate.instant('general.status'),
    this.translate.instant('attendance.guard_name'),
    this.translate.instant('general.the_date'),
    this.translate.instant('general.time'),
    this.translate.instant('general.note'),
    ''
  ]

  constructor(

    public settings: AppSettingsService,
    private auth: AuthService,
    private modal: ModalsService,
    private translate: TranslateService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    private attendance: AttendanceService

  ) { }

  ngOnInit(): void {

    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'attendance', true, 'general.create', true, false, false))

    this.getData()

    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'attendance') return;
      this.getData();
    })

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;
      const dialogRef = this.dialog.open(NewAttendanceComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      })

    })

    this.unsubscribe.push(toolbarCreateSubject);



  }
  
  async getData() {

    let data = this.attendance.getAll().subscribe(async (res: any) => {
      if (!res) return;

      this.items.next(res.content)
      if (res.content.length <= 0) return this.apiQuery.resetPagination()

      this.apiQuery.totalPages.next(res.count - 1)
    })

    this.unsubscribe.push(data);

  }


  
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }

}
