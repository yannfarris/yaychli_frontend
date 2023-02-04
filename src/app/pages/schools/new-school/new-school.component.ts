import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SchoolService } from 'src/app/api/school/school.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';



@Component({
  selector: 'app-new-school',
  templateUrl: './new-school.component.html',
  styleUrls: ['./new-school.component.scss']
})
export class NewSchoolComponent implements OnInit, OnDestroy {

  isRtl: boolean = false
  form: any;
  numberPattern = "^[0-9]+$";
  schoolId = "";
  private unsubscribe: Subscription[] = [];

  constructor(

    private dialogRef: MatDialogRef<NewSchoolComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private school: SchoolService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,

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

      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      address: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      ads_status: [true],
      max_students: ['', Validators.required],
      due_date: ['', Validators.required],
      currency: ['iqd'],
      note: [''],

    });

    let max_students = this.form.get('max_students').valueChanges.subscribe((res: any) => {

      if (!res || res === '') return

      let value = this.auth.currentUserSubject.value.max_students
      if (!value) return

      if (res > value) {
        this.form.controls['max_students'].setValue(value)
        return
      }

    })

    this.unsubscribe.push(max_students);

    var due_date = new Date();
    due_date.setMonth(due_date.getMonth() + 12);
    this.form.controls['due_date'].setValue(due_date)

  }

  closeModal() {

    if (this.form.dirty) {
      this.modal.generalWarningMessageModal('error.exit_before_safe', 'general.yes', 'general.no').then(result => {

        if (result.isConfirmed) {
          this.finalModalClose()
          this.formReset()
        }

      })
    }
    else {

      this.finalModalClose()
      this.formReset()

    }

  }

  finalModalClose(id:string = '') {
    this.dialogRef.close({ id });
  }

  formReset() {
    this.form.reset();

  }

  async save() {
    let max_students = Number(this.auth.currentUserSubject.value.max_students)

    if (Number(this.form.get('max_students').value) > max_students) {

      this.modal.generalErrorMessageModal('school.max_students_warn')
      this.finalModalClose()
      this.formReset()
      return;

    }

    if (!max_students) {
      this.modal.generalErrorMessageModal()
      this.finalModalClose()
      this.formReset()
      return;
    }

    if (this.form.valid) {

      let fields = this.form.controls
      let fieldsData: any = {}

      for (const field in fields) {

        fieldsData[field] = fields[field].value != '' ? fields[field].value : null

      }

      fieldsData['ads_status'] = fieldsData?.ads_status ? 'active' : 'inactive'

      if (!Number(fieldsData.max_students)) {
        this.modal.generalErrorMessageModal()
        return
      }

      fieldsData['ad'] = Number(fieldsData.max_students)

      let newData = this.school.new(fieldsData).subscribe((res: any) => {

        if (!res) return;
        // this.modal.generalSuccessMessageModal('general.create_succes')
        this.auth.getUserByToken().subscribe()
        this.apiQuery.resetApiKey()

        this.schoolId = res.id
        this.formReset()
        this.finalModalClose(res.id)
      })

      // this.unsubscribe.push(newData);

    }

    else {
      this.modal.generalErrorMessageModal()
    }
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
