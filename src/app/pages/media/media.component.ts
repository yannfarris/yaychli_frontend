import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { MediaService } from 'src/app/api/media/media.service';
import { ApiQueryService } from 'src/app/shared/services/apiQuery/api-query.service';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';
import { RoleService } from 'src/app/shared/services/role/role.service';
import { FileUploadComponent } from 'src/app/shared/upload/file-upload/file-upload.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(

    public media: MediaService,
    private apiQuery: ApiQueryService,
    public settings: AppSettingsService,
    public dialog: MatDialog,
    public role: RoleService,
    private modal: ModalsService

  ) { }

  ngOnInit(): void {
    this.settings.pageSettings.next(this.settings.getPageSettingsValue(true, 'media', true, 'general.upload_file'))

    this.getAll();


    let isApply = this.apiQuery.isApply.subscribe(res => {
      if (!res) return;
      if (this.settings.pageSettings.value.pageType !== 'media') return;
      this.items.next([])
      this.getAll()
    })

    this.unsubscribe.push(isApply);

    let toolbarCreateSubject = this.settings.toolbarCreateSubject.subscribe(res => {

      if (!res) return;

      const dialogRef = this.dialog.open(FileUploadComponent, {

        disableClose: true,
        width: '90vw',
        maxWidth: '600px',

      }).afterClosed().pipe(take(1)).subscribe(res => {

      })


    })

    this.unsubscribe.push(toolbarCreateSubject);

  }

  getImage(item: any) {
    if (item.type === 'doc') return '';
    let image = item.id
    if (!image) return
    let url = `url(${this.settings.url}media/${image})`

    return url
  }

  viewImage(item: any) {
    // if(item.type === 'doc') return '';
    let image = item.id
    if (!image) return
    let url = `${this.settings.url}media/${image}`

    window.open(url, "_blank");
  }

  getAll() {
    this.media.getAll().subscribe((res: any) => {
      if (!res) return;

      if (res.content.length <= 0) return this.apiQuery.resetPagination()
      this.apiQuery.totalPages.next(res.count - 1)
      this.items.next(res.content)
    })
  }

  removeItem(id: string){
    let data = this.items.value
    let index = this.items.value.findIndex((item:any) => item.id === id)

    data.splice(index, 1)

    this.items.next(data)

  }

 async delete(id:string) {
    
    let warn = await this.modal.generalWarningMessageModal('general.general_delete_warn').then(res => res)
    if (!warn.isConfirmed) return;
    
    this.media.delete(id).subscribe(res =>{
      if(!res) return;
      this.removeItem(id)
      this.media.isneMediaInfo.next(true)
      this.modal.generalSuccessMessageModal('general.delete_complet')
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.apiQuery.resetApiKey(true)
  }

}
