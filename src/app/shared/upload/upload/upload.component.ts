import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaService } from 'src/app/api/media/media.service';
import { ModalsService } from '../../services/modals/modals.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {

  constructor(

    public media: MediaService,
    private modal: ModalsService

  ) { }

  async onSelect(event: any) {
    let addedFiles = event.addedFiles
    
    for (let item of addedFiles) {
      if(this.media.allowedType === 'image' && !this.media.isImage(item.type)) return this.modal.generalErrorMessageModal('general.only_image') 
      if(this.media.allowedType === 'doc' && !this.media.isPdf(item.type)) return this.modal.generalErrorMessageModal('general.only_pdf') 
    }


    let maxFile = this.media.maxFile
    let newLength = this.media.files.length + event.addedFiles.length
    let values = JSON.stringify([{ value: this.media.maxFile }])

    if (newLength > maxFile) return this.modal.generalErrorMessagWithValue('general.you_cant_upload', values)

    this.media.files.push(...event.addedFiles);

  }

  acceptableFileExtensions(){
    let image = 'image/png, image/jpeg, image/jpg';
    let pdf = 'application/pdf'
    let any = 'image/png, image/jpeg, image/jpg, application/pdf'
    if (this.media.allowedType === 'image') return image
    if (this.media.allowedType === 'doc') return pdf
    return any
  }

  isImage(type: string) {
    if (type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return true;
    return false;
  }

  onRemove(event: any) {
    this.media.files.splice(this.media.files.indexOf(event), 1);
  }

  ngOnDestroy(): void {
    this.media.reset()
  }

}
