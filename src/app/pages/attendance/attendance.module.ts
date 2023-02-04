import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { NewAttendanceComponent } from './new-attendance/new-attendance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { CardsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { BarcodeScannerLivestreamOverlayModule, BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { TableModule } from 'src/app/shared/modules/table/table.module';

@NgModule({
  declarations: [
    AttendanceComponent,
    NewAttendanceComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    CardsModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    ReactiveFormsModule,
    BarcodeScannerLivestreamOverlayModule,
    BarcodeScannerLivestreamModule,
    TableModule
  ]
})
export class AttendanceModule { }
