import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripsRoutingModule } from './trips-routing.module';
import { TripsComponent } from './trips.component';

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
import { NewComponent } from './new/new.component';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NewRevComponent } from './new-rev/new-rev.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { UpdateSeatComponent } from './update-seat/update-seat.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import {NgxPrintModule} from 'ngx-print';
import { CustomerListComponent } from './customer-list/customer-list.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    TripsComponent,
    NewComponent,
    NewRevComponent,
    InvoiceComponent,
    UpdateSeatComponent,
    CustomerInfoComponent,
    CustomerListComponent,
  ],
  imports: [
    CommonModule,
    TripsRoutingModule,
    CommonModule,
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
    NgbTimepickerModule,
    NgxPrintModule,
    DragDropModule,
    
  ]
})
export class TripsModule { }
