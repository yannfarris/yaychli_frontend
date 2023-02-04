import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectMediaComponent } from './select-media.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { NoDataModule } from '../no-data/no-data.module';
import { SearchModule } from '../search/search.module';



@NgModule({
  declarations: [
    SelectMediaComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxContentLoadingModule,
    NoDataModule,
    SearchModule
  ],
  exports:[
    SelectMediaComponent
  ]
})
export class SelectMediaModule { }
