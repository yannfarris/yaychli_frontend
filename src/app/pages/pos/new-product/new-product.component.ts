import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PosService } from 'src/app/api/pos/pos.service';
import { SchoolService } from 'src/app/api/school/school.service';
import { UserService } from 'src/app/api/user/user.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit, OnDestroy {


  isRtl: boolean = false
  form: any;
  numberPattern = "^[0-9]+$";
  schoolId = null
  private unsubscribe: Subscription[] = [];

  schools: BehaviorSubject<any> = new BehaviorSubject<any>([])
  isUpdate = false;
  selectedMedia: Array<any> = []
  constructor(

    private dialogRef: MatDialogRef<NewProductComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    private user: UserService,
    public role: RoleService,
    public pos: PosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    

  ) { }

  ngOnInit(): void {

    if (this.data && this.data?.school_id) this.schoolId = this.data.school_id

    if (this.getValue('id')) this.isUpdate = true;

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.form = this.formBuilder.group({

      id: [this.getValue('id')],
      name: [this.getValue('name'), Validators.required],
      price: [this.getValue('price'), [Validators.required]], 
      barcode: [this.getValue('price'), [Validators.required]], 
      featured: [this.getValue('featured')], 
      note: [this.getValue('note')], 

    });

    this.form.get('barcode').setValue(this.code())

  }

  randomNumbers(length: number) {

    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));

  }

  code(init: string = 'Product') {
    let userInit = init.substring(0, 2).toUpperCase()
    let code = `${userInit}-${this.randomNumbers(9)}`
    return code
  }

  getValue(value: string, defaultValue: any = '') {

    if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value]
    return defaultValue
  }


  closeModal() {

    if (this.form.dirty && !this.isUpdate) {
      this.modal.generalWarningMessageModal('error.exit_before_safe', 'general.yes', 'general.no').then(result => {

        if (result.isConfirmed) {
          this.finalModalClose();
          this.formReset()
        }

      })
    }
    else {

      this.finalModalClose();
      this.formReset()

    }

  }

  formReset() {
    this.form.reset();

  }

  finalModalClose(id: string = '') {
    this.dialogRef.close({ id });
  }

  async save() {

    if (this.form.valid) {

      let fields = this.form.controls
      let fieldsData: any = {}

      for (const field in fields) {
        fieldsData[field] = fields[field].value != '' ? fields[field].value : null
      }

        let newData = this.pos.newProduct(fieldsData).subscribe(res => {

          if (!res) return;
          this.formReset()
          if(this.settings.pageSettings.value.pageType === 'pos') this.apiQuery.apply()
          this.modal.generalSuccessMessageModal('general.add_succ')
          this.finalModalClose('done');
        })

        return


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
