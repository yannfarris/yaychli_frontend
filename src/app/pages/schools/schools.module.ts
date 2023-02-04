import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolsComponent } from './schools.component';
import { CardsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { NewSchoolComponent } from './new-school/new-school.component';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';


import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SchoolsComponent,
    NewSchoolComponent,
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    TranslateModule,
    CardsModule,
    MdModule,
    NgxContentLoadingModule,
    NoDataModule,
    PaginationModule,
    SearchModule,
    ReactiveFormsModule
  ]
})
export class SchoolsModule { }
