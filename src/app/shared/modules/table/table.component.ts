import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';
import { AuthService } from '../../services/auth/auth.service';
import { ViewMediaComponent } from 'src/app/shared/modules/view-media/view-media.component';
import { ViewUserComponent } from 'src/app/shared/modules/view-user/view-user.component';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { ViewInvoiceComponent } from 'src/app/shared/modules/view-invoice/view-invoice.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('panelState', [
      state('closed', style({ height: '60px', overflow: 'hidden' })),
      state('open', style({ height: '*' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class TableComponent implements OnInit {
  @Input() items: Array<any>;
  @Input() rows: Array<any>;
  @Input() sort: Array<any>;
  @Input() isEdit = true;
  @Input() isStatus = true;
  @Input() isDelete = true;
  @Input() dataType: Array<any> = [];
  @Input() isDate = true;
  @Input() isTime = false;
  @Input() isNote = false;
  @Input() isSymbol = false;

  folded = 'closed';

  constructor(
    public settings: AppSettingsService,
    public role: RoleService,
    private modal: ModalsService,
    private translate: TranslateService,
    public atuh: AuthService,
    public dialog: MatDialog,
    private apiQuery: ApiQueryService
  ) { }

  ngOnInit(): void {
  }

  isMediaFiles(items: any) {
    if (!items.hasOwnProperty('media')) return false
    let media = items?.media.filter((res: any) => res.type !== "profile")
    if (!media) return false
    let mediaArr = media
    if (mediaArr && mediaArr.length > 0) return true;
    return false
  }

  viewDocs(item: any) {

    let mediaArr = item.media.filter((res: any) => res.type !== 'profile')

    const dialogRef = this.dialog.open(ViewMediaComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { media: mediaArr, name: item?.name }

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.isAction) this.apiQuery.apply()
    })


  }

  viewInvoice(item: any){
    let data = item

    const dialogRef = this.dialog.open(ViewInvoiceComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '500px',
      data: data

    })

  }

  nameState(value: any) {

    if (this.dataType.length <= 0) {
      if (value.hasOwnProperty('name')) return true;
      return false;
    }

    for (let item of this.dataType) {
      let valueCheck = `${item}.name`
      if (value.hasOwnProperty(valueCheck)) return true

    }
    return false;


  }

  getNameText(value: any) {
    return value.name || value[`${this.dataType[0]}.name`]
  }

  getLength(text: string) {
    if (!text) return 0;
    return text.length
  }

  toggleFold(item: any) {
    if (!item) return;
    if (item.length < 130) return
    this.folded = this.folded === 'open' ? 'closed' : 'open';
  }

  async actionHandle(id: string, type: string) {

    if (type === 'delete') {
      let warn = await this.modal.generalWarningMessageModal('general.general_delete_warn').then(res => res)
      if (!warn.isConfirmed) return;
    }

    this.settings.tableAction.next({ id, type })
  }

  getSubItem(item: any) {

    let data: any = []
    this.sort.forEach((el) => {

      if (el === 'photo_url') return;
      if (el === 'name') return;
      if (el === 'createdAt') return;
      if (el === 'note') return;
      for (let item of this.dataType) {
        if (el === `${item}.name`) return;
      }

      if (item.hasOwnProperty(el)) data.push(item[el]);

    })
    return data

  }

  getItemText(itemText: string) {
    if (itemText === 'admin') return this.translate.instant('general.admin')
    if (itemText === 'manager') return this.translate.instant('general.manager')
    if (itemText === 'guard') return this.translate.instant('user.guard')
    if (itemText === 'parent') return this.translate.instant('user.parents')
    if (itemText === 'seller') return this.translate.instant('user.seller')
    if (itemText === 'student') return this.translate.instant('user.student')
    if (itemText === 'teacher') return this.translate.instant('user.teacher')
    if (itemText === 'accountant') return this.translate.instant('user.accountant')
    if (itemText === 'active') return this.translate.instant('general.active')
    if (itemText === 'inactive') return this.translate.instant('general.inactive')
    if (itemText === 'out') return this.translate.instant('attendance.out')
    if (itemText === 'in') return this.translate.instant('attendance.in')
    if (itemText === 'student_credit') return this.translate.instant('accountant.student_credit')
    if (itemText === 'student_sub') return this.translate.instant('accountant.student_sub')
    if (itemText === 'expenses') return this.translate.instant('accountant.expenses_2')
    if(Number(itemText)) return Number(itemText).toLocaleString()
    return itemText;
  }

  getImage(item: any) {
    let mediaSource = item.media || item[`${this.dataType[0]}.media`]
    return false;
    let mediaArr = mediaSource.find((res: any) => res.type === 'profile')
    let image = mediaArr?.id
    if (!image) return
    let url = `${this.settings.url}media/${image}`
    return url
  }

  isUser() {
    if (this.settings.pageSettings.value.pageType === 'user') return true
    return false;
  }

  viewUser(item: any) {
    if(this.atuh.currentUserSubject.value.id === item.id) return false

    if (!item) return
    if (!this.isUser()) return false

    const dialogRef = this.dialog.open(ViewUserComponent, {
      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { item }
    })

  }


}
