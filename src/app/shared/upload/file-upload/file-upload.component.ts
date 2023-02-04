import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MediaService } from 'src/app/api/media/media.service';
import { ApiQueryService } from '../../services/apiQuery/api-query.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { ModalsService } from '../../services/modals/modals.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  constructor(

    private dialogRef: MatDialogRef<FileUploadComponent>,
    public settings: AppSettingsService,
    private apiQuery: ApiQueryService,
    private media: MediaService,
    private modal: ModalsService

  ) { }

  ngOnInit(): void {

    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);

    this.media.allowedType = 'any';

  }

  closeModal(mediaArr: any = []){
    this.dialogRef.close(mediaArr)
  }

  save(){

    if(this.media.files.length <= 0) return;
   
    let newData = this.media.new().subscribe(res =>{
      if(!res) return;
      this.media.isneMediaInfo.next(true)
      this.apiQuery.apply()
      this.closeModal(res)

    })
    

  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
