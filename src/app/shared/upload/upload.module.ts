import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    TranslateModule,
    InlineSVGModule
  ],
  exports: [
    UploadComponent,
    FileUploadComponent
  ]
})
export class UploadModule { }
