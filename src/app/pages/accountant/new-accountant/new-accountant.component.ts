import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountantService } from 'src/app/api/accountant/accountant.service';
import { UserService } from 'src/app/api/user/user.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-new-accountant',
  templateUrl: './new-accountant.component.html',
  styleUrls: ['./new-accountant.component.scss']
})
export class NewAccountantComponent implements OnInit, OnDestroy {

  isRtl: boolean = false
  form: any;
  numberPattern = "^[0-9]+$";
  private unsubscribe: Subscription[] = [];
  users: BehaviorSubject<any> = new BehaviorSubject<any>([])

  constructor(

    private dialogRef: MatDialogRef<NewAccountantComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    public role: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountant: AccountantService,
    private user: UserService

  ) { }

  ngOnInit(): void {

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);


    this.form = this.formBuilder.group({
      type: [this.getType(), Validators.required],
      amount: [0],
      sub_end_date: [new Date()],
      daily_cash: [''],
      user_id: [''],
      note: [''],
      record_name: [''],
      date: [new Date()],
    });

  }

  getType(){
    let type = this.settings.pageSettings.value.pageType
    if(type === 'stud_accountant') return 'student_credit'
    if(type === 'exp_accountant') return 'expenses'
    return
  }

  closeModal() {

    if (this.form.dirty) {
      this.modal.generalWarningMessageModal('error.exit_before_safe', 'general.yes', 'general.no').then(result => {

        if (result.isConfirmed) {
          this.dialogRef.close();
          this.formReset()
        }

      })
    }
    else {

      this.dialogRef.close();
      this.formReset()

    }

  }

  formReset() {
    this.form.reset();

  }

  getCat(){
    let type = this.form.get('type').value
    if(type === 'expenses') return 'expenses'
    return 'student'
  }

  async save() {
    let type = this.form.get('type').value
    let daily_cash = this.form.get('daily_cash').value

    if(type === 'daily_cash' && !daily_cash ) return this.modal.generalErrorMessageModal()
    // if(type === 'daily_cash' && this.form.get('user_id').value === '' ) return this.modal.generalErrorMessageModal()

    if (this.form.valid) {

      let fields = this.form.controls
      let fieldsData: any = {}

      for (const field in fields) {
        fieldsData[field] = fields[field].value != '' ? fields[field].value : null
      }
      fieldsData['cat'] = this.getCat()
   
      let newData = this.accountant.new(fieldsData).subscribe((res:any) => {

        if (!res) return;
        this.dialogRef.close({fieldsData})

      })

      // this.unsubscribe.push(newData);

    }

    else {
      this.modal.generalErrorMessageModal()
    }
  }


  ngOnDestroy(): void {
    this.apiQuery.resetSearch()
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
