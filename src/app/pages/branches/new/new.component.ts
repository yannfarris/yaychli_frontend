import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/branch/branch.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

@Component({
  selector: 'app-new-school',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {

  isRtl: boolean = false
  form: any;
  id: string;
  numberPattern = "^[0-9]+$";
  private unsubscribe: Subscription[] = [];

  constructor(

    private dialogRef: MatDialogRef<NewComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private branch: BranchService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {

    this.id = this.data?.item?.id

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.form = this.formBuilder.group({
      id: [this.getValue('id')],
      name: [this.getValue('name', ''), Validators.required],
      address: [this.getValue('address', '')],
      note: [this.getValue('note', '')],
    });

  }

  getValue(value: string, defaultValue: any = '') {

    if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value]
    return defaultValue
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


    if (this.form.valid) {

      let fields = this.form.controls
      let fieldsData: any = {}

      for (const field in fields) {

        fieldsData[field] = fields[field].value != '' ? fields[field].value : null

      }

      let newData = this.branch.new(fieldsData).subscribe((res: any) => {

        if (!res) return;
        this.modal.generalSuccessMessageModal('create_done')
        this.apiQuery.resetApiKey()
        this.formReset()
        this.finalModalClose(res.id)
      })

      this.unsubscribe.push(newData);

    }

    else {
      this.modal.generalErrorMessageModal()
    }
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}

