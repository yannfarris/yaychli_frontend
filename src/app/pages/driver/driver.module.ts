import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { DriverComponent } from './driver.component';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { CardsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FieldSearchModule } from 'src/app/shared/modules/field-search/field-search.module';
import { TableModule } from 'src/app/shared/modules/table/table.module';
import { UploadModule } from 'src/app/shared/upload/upload.module';
import { SelectMediaModule } from 'src/app/shared/modules/select-media/select-media.module';
import { NewComponent } from './new/new.component';


@NgModule({
  declarations: [
    DriverComponent,
    NewComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    FieldSearchModule,
    TableModule,
    UploadModule,
    SelectMediaModule
  ]
})
export class DriverModule { }
