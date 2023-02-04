import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdsRoutingModule } from './ads-routing.module';
import { AdsComponent } from './ads.component';
import { NewAdsComponent } from './new-ads/new-ads.component';
import { FieldSearchModule } from 'src/app/shared/modules/field-search/field-search.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadModule } from 'src/app/shared/upload/upload.module';


@NgModule({
  declarations: [
    AdsComponent,
    NewAdsComponent
  ],
  imports: [
    CommonModule,
    AdsRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    FieldSearchModule,
    NgxDropzoneModule,
    UploadModule
  ]
})
export class AdsModule { }
