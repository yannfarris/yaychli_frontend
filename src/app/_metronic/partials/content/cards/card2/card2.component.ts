import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SchoolService } from 'src/app/api/school/school.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NewUserComponent } from 'src/app/pages/user/new-user/new-user.component';
import { FieldModalComponent } from 'src/app/shared/modules/field-modal/field-modal.component';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { IconUserModel } from '../icon-user.model';
import { BehaviorSubject, take } from 'rxjs';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./style.scss']

})

export class Card2Component {
  @Input() icon: string = '';
  @Input() badgeColor: string = '';
  @Input() status: string = '';
  @Input() statusId: string = '';
  @Input() statusColor: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() date: string = '';
  @Input() dueDate: string = '';
  @Input() phone: string = '';
  @Input() email: string = '';
  @Input() progress: number = 0;
  @Input() init_progress: number = 0;
  @Input() users: Array<IconUserModel> = [];
  @Input() facebook: string = '';
  @Input() instagram: string = '';
  @Input() twitter: string = '';
  @Input() persent: number = 0;
  @Input() usedDays: number = 0;
  @Input() remaningDays: number = 0;
  @Input() id: any = 0;
  @Input() adsStatus: any = 0;
  @Input() maxSize: any = '';
  math = Math

  orderDate: Date;
  newDueDateValue: BehaviorSubject<any> = new BehaviorSubject<any>('')
  @ViewChild('newDate') datePicker: any

  constructor(
    public settings: AppSettingsService,
    private translate: TranslateService,
    private school: SchoolService,
    private apiQuery: ApiQueryService,
    private modal: ModalsService,
    private auth: AuthService,
    public dialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
  ) {

    if (this.settings.currentLang.value === 'ar') {
      this.dateAdapter.setLocale('ar');

    }

  }
  getNumber(value: number) {
    return Number(value)
  }
  getRemaningStudents() {
    let progress = Number(this.progress)
    let init_progress = Number(this.init_progress)
    let studentsCount = Math.abs(progress - init_progress)
    let value = Math.ceil(studentsCount / this.init_progress * 100)
    return Number(value);
  }

  getStudentPersent() {
    return this.persent
  }

  addNewAdmin(id: string) {

    const dialogRef = this.dialog.open(NewUserComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { school_id: id }
    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (!res) return;
      if (res.id !== 'done') return;
      this.modal.generalSuccessMessageModal('general.create_succes')
    });;

  }

  async delete(id: string) {

    let warn = await this.modal.generalWarningMessageModal('general.delete_warn').then(res => res)
    if (!warn.isConfirmed) return;

    this.school.delete(id).subscribe(res => {
      if (!res) return;
      this.auth.getUserByToken().subscribe()
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.delete_complet')
    })
  }

  changeState(id: string, state: string) {
    this.school.changeState(id, state).subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_state')

    })
  }

  changeAdsStatus(id: string, state: string) {
    this.school.changeAdsStatus(id, state).subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_state')

    })
  }

  changeMaxStudent() {

    let data = {
      header_title: 'school.change_max_student',
      field_title: 'general.quata',
      field_type: 'number',
      is_school: true,

    }

    const dialogRef = this.dialog.open(FieldModalComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { data }

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if(!res) return;

      let fieldData = {
        school_id: this.id,
        field: res.data
      }

      this.school.changeMaxStudent(fieldData).subscribe(schoolRes =>{
        if(!schoolRes) return;
        this.modal.generalSuccessMessageModal('general.change_succ')

        this.auth.getUserByToken().subscribe()
        this.apiQuery.apply()

      })

    });
  }

  changeMaxSize() {

    let data = {
      header_title: 'school.change_max_size',
      field_title: 'school.size_in_gb',
      field_type: 'number',

    }

    const dialogRef = this.dialog.open(FieldModalComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { data }

    }).afterClosed().pipe(take(1)).subscribe(res => {
      if(!res) return;

      let fieldData = {
        school_id: this.id,
        field: res.data
      }

      this.school.changeMaxSize(fieldData).subscribe(res =>{
        if(!res) return;
        this.modal.generalSuccessMessageModal('general.change_succ')
        this.apiQuery.apply()

      })

    });

  }
  changeDueDate(id: string, date: string) {

    this.school.changeDueDate(id, date).subscribe(res => {

      if (!res) return;
      this.apiQuery.apply()
      this.modal.generalSuccessMessageModal('general.change_due_date')

    })

  }

  dateChange($event: any) {

    this.newDueDateValue.next($event)

    this.changeDueDate(this.id, $event)

  }

  newDueDate() {

    this.datePicker.open()

  }

  getImage() {

    let url = `${this.settings.url}media/${this.icon}`
    return url
  }


}
