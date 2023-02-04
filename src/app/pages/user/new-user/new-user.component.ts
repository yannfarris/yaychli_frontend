import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription, BehaviorSubject } from 'rxjs';
import { BranchService } from 'src/app/api/branch/branch.service';
import { UserService } from 'src/app/api/user/user.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { NewComponent } from 'src/app/pages/branches/new/new.component';

@Component({
  selector: 'app-new-school',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  isRtl: boolean = false;
  form: any;
  id: string;
  numberPattern = '^[0-9]+$';
  private unsubscribe: Subscription[] = [];
  isShowPassword = false;
  isHideBranches = false;
  branches: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private dialogRef: MatDialogRef<NewUserComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private branch: BranchService,
    private user: UserService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public role: RoleService
  ) {}

  ngOnInit(): void {
    this.id = this.data?.item?.id;

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true;
    }

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.form = this.formBuilder.group({
      id: [this.getValue('id')],
      name: [this.getValue('name', ''), Validators.required],
      account_type: [this.getValue('account_type', 'admin')],
      password: [this.getValue('password', '')],
      email: [this.getValue('email', ''), Validators.required],
      branch_id: [this.getValue('branch_id', ''), Validators.required],
      note: [this.getValue('note', '')],
    });

    if(this.role.isMegaAdmin()) this.getBranchs()
    if(!this.role.isMegaAdmin()) this.form.get('branch_id').setValue(this.auth.currentUserValue.branch_id)


    this.form.get('account_type').valueChanges.subscribe((res: any) => {

      if(res === 'mega_admin'){
        this.isHideBranches = true
        this.form.get('branch_id').setValue(null)
      }

      this.isHideBranches = false

    })

  }

  newBranch(){    

      const dialogRef = this.dialog.open(NewComponent, {
  
        disableClose: true,
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '95vh',
  
      })
  
  }

  getValue(value: string, defaultValue: any = '') {
    if (this.data?.item?.hasOwnProperty(value)) return this.data.item[value];
    return defaultValue;
  }

 getBranchs() {

    this.branch.getAllLite().subscribe(async (res:any) => {

      if(res.length <= 0){
        
        let noBranches = await this.modal.generalWarningMessageModal('no_branches', 'general.yes', 'general.no')
        
        if(noBranches.isConfirmed){
          this.newBranch()
          this.closeModal()
        }

        if(!noBranches.isConfirmed) this.closeModal()
   

      }
      

      if (!res) return;

      this.branches.next(res)
      this.form.get('branch_id').setValue(res[0].id)    });
    
  }

  isPassword(){
    if(this.id && !this.role.isMegaAdmin()) return false;
    return true
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  closeModal() {
    if (this.form.dirty) {
      this.modal
        .generalWarningMessageModal(
          'error.exit_before_safe',
          'general.yes',
          'general.no'
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.finalModalClose();
            this.formReset();
          }
        });
    } else {
      this.finalModalClose();
      this.formReset();
    }
  }

  finalModalClose(id: string = '') {
    this.dialogRef.close({ id });
  }

  formReset() {
    this.form.reset();
  }

  async save() {
    if (this.form.valid) {
      let fields = this.form.controls;
      let fieldsData: any = {};

      for (const field in fields) {
        fieldsData[field] =
          fields[field].value != '' ? fields[field].value : null;
      }

      let newData = this.user.new(fieldsData).subscribe((res: any) => {
        if (!res) return;
        this.finalModalClose('done');
      });

      // this.unsubscribe.push(newData);
    } else {
      this.modal.generalErrorMessageModal();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
