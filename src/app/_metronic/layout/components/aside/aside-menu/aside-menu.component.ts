import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { environment } from '../../../../../../environments/environment';
import { NewAttendanceComponent } from 'src/app/pages/attendance/new-attendance/new-attendance.component';
import { NewProductComponent } from 'src/app/pages/pos/new-product/new-product.component';
import { NewAccountantComponent } from 'src/app/pages/accountant/new-accountant/new-accountant.component';
import { take } from 'rxjs';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';


@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor(
    public settings: AppSettingsService,
    public role: RoleService,
    public dialog: MatDialog,
    public apiQuery: ApiQueryService,

  ) { }

  showAttendance() {
    const dialogRef = this.dialog.open(NewAttendanceComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',

    })
  }

  newProd(){
    const dialogRef = this.dialog.open(NewProductComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',

    })
  }
  newRecords(){
    const dialogRef = this.dialog.open(NewAccountantComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',

    }).afterClosed().pipe(take(1)).subscribe(res =>{
      if(!res) return
      if(this.settings.pageSettings.value.pageType === 'accountant') this.apiQuery.apply()
    })
  }

}
