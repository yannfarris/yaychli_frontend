import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { FieldModalComponent } from 'src/app/shared/modules/field-modal/field-modal.component';
import { FileUploadComponent } from 'src/app/shared/upload/file-upload/file-upload.component';
import { UserService } from 'src/app/api/user/user.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { MediaService } from 'src/app/api/media/media.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  user$:any = {}
  private unsubscribe: Subscription[] = [];

  constructor(

    private auth: AuthService,
    private translationService: TranslationService,
    public settings: AppSettingsService,
    public role:RoleService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public user: UserService,
    private modal: ModalsService,    
    private media: MediaService

  ) { }

  ngOnInit(): void {

    let currentUserSubject = this.auth.currentUserSubject.subscribe(res =>{
      if(!res) return;
      this.user$ = res;

    })

    this.unsubscribe.push(currentUserSubject);

  }

  changeName(){

    let data = {
      header_title: 'change_name',
      field_title: 'name',
      field_type: 'text',

    }


    const dialogRef = this.dialog.open(FieldModalComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { data }

    }).afterClosed().pipe(take(1)).subscribe(res =>{
      if(!res) return;
      this.user.changeName(this.auth.currentUserSubject.value.id ,res.data).subscribe(pass =>{
        if(!pass) return;
        this.modal.generalSuccessMessageModal('update_done');
      })
    })
  }
  changeEmail(){

    let data = {
      header_title: 'change_email',
      field_title: 'email',
      field_type: 'text',

    }


    const dialogRef = this.dialog.open(FieldModalComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { data }

    }).afterClosed().pipe(take(1)).subscribe(res =>{
      if(!res) return;
      this.user.changeEmail(this.auth.currentUserSubject.value.id ,res.data).subscribe(pass =>{
        if(!pass) return;
        this.modal.generalSuccessMessageModal('general.change_succ').then(res =>{
          location.reload()
        })
      })
    })
  }

  changePassword(){

    let data = {
      header_title: 'change_password',
      field_title: 'password',
      field_type: 'password',

    }


    const dialogRef = this.dialog.open(FieldModalComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',
      data: { data }

    }).afterClosed().pipe(take(1)).subscribe(res =>{
      if(!res) return;
      this.user.changePassword(this.auth.currentUserSubject.value.id ,res.data).subscribe(pass =>{
        if(!pass) return;

        this.modal.generalSuccessMessageModal('update_done').then(res =>{
          location.reload()
        })
      })
    })
  }

  changeProfileImage(){

    this.media.maxFile = 1

    const dialogRef = this.dialog.open(FileUploadComponent, {

      disableClose: true,
      width: '90vw',
      maxWidth: '600px',

    }).afterClosed().subscribe(res => {
      if(!res) return;
      let media = res?.mediaIdsArr[0]
      this.user.changeProfileImage(media).subscribe(res2 => {
        if(!res2) return;
        location.reload()
      })

    })

  }



  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }

}
