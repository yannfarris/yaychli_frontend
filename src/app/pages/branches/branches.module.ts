import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchesComponent } from './branches.component';
import { CardsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { MdModule } from 'src/app/shared/modules/md/md.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { NoDataModule } from 'src/app/shared/modules/no-data/no-data.module';
import { PaginationModule } from 'src/app/shared/modules/pagination/pagination.module';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NewComponent } from './new/new.component';


@NgModule({
  declarations: [
    BranchesComponent,
    NewComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule,
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
export class BranchesModule { }
