import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediaService } from 'src/app/api/media/media.service';
import { AppSettingsService } from '../../services/appSettings/app-settings.service';
import { ModalsService } from '../../services/modals/modals.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})
export class ViewMediaComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  items: BehaviorSubject<any> = new BehaviorSubject([])
  isAction: boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewMediaComponent>,
    public settings: AppSettingsService,
    public role:RoleService,
    private modal:ModalsService,
    private media:MediaService,
  ) { }

  ngOnInit(): void {
    let media = this.data?.media
    this.items.next(media)
    
    let dialogRef = this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });

    this.unsubscribe.push(dialogRef);
  }

  closeModal() {

    this.dialogRef.close({ isAction: this.isAction });

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
      this.isAction = true
      this.media.isneMediaInfo.next(true)
      this.modal.generalSuccessMessageModal('general.delete_complet')

      if(this.items.value.length <= 0) return this.closeModal()
    })
  }
  
  isImage(name:any) {
    if(name.includes('jpg') || name.includes('jpeg') || name.includes('png')) return true
    return false
  }



  viewImage(item: any){
    // if(item.type === 'doc') return '';
    let image = item
    if (!image) return
    let url = `${this.settings.url}media/${image}`

    window.open(url, "_blank");
  }

  getImage(item:any){
    let image = item
    if (!image) return
    let url = `url(${this.settings.url}media/${image})`
    return url
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
