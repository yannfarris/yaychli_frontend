import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { AuthService } from '../../services/auth/auth.service';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-field-modal',
  templateUrl: './field-modal.component.html',
  styleUrls: ['./field-modal.component.scss']
})
export class FieldModalComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  form: any;
  isRtl: boolean = false
  header: string = this.data?.data?.header_title
  field: string = this.data?.data?.field_title
  type: string = this.data?.data?.field_type
  isSchool: string = this.data?.data?.is_school

  constructor(

    private dialogRef: MatDialogRef<FieldModalComponent>,
    private formBuilder: FormBuilder,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    public role: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    if (this.settings.currentLang.value === 'ar') {
      this.isRtl = true
    }
  
    this.form = this.formBuilder.group({
      field: [this.data?.field, Validators.required],

    });



  }

  closeModal() {
    this.dialogRef.close();
  }
  closeModalWithData(data: any = {}) {
    this.dialogRef.close({ data });
  }

  save(){
    
    let data = this.form.get('field').value
    if(!data) return;
    this.closeModalWithData(data)

  }


}
