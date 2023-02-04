import { formatNumber } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  formatnumber = formatNumber
  constructor(

    private dialogRef: MatDialogRef<ViewInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public settings: AppSettingsService,
    public auth: AuthService

  ) { }

  ngOnInit(): void {
    const backdropClick = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(backdropClick);

  }

  // getProfileImage(){
  //   let image = this.auth.currentUserSubject.value.school.
  //   if(!image) return false
  //   let url = `${this.settings.url}media/${image}`

  //   return url
  // }

  
  closeModal() {

    this.dialogRef.close();

  }

}
