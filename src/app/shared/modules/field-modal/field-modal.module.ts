import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldModalComponent } from './field-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
  declarations: [
    FieldModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MdModule,
    InlineSVGModule
  ],
  exports: [
    FieldModalComponent
  ]
})
export class FieldModalModule { }
