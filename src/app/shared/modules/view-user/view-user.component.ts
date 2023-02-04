import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { AuthService } from '../../services/auth/auth.service';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([])
  user$:any;
  image: any = {}

  constructor(
    
    private dialogRef: MatDialogRef<ViewUserComponent>,
    public settings: AppSettingsService,
    private modal: ModalsService,
    public auth: AuthService,
    private apiQuery: ApiQueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public role: RoleService
  ) { }

  ngOnInit(): void {

    this.user$ = this.data.item

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.image = this.user$.media.find((res:any) => res.type === 'profile')
  }

  closeModal(){
    this.dialogRef.close();
  }

  save(){

  }

  getProfileImage(){
    let image = this.image?.id
    if(!image) return false
    let url = `${this.settings.url}media/${image}`

    return url
  }


}
