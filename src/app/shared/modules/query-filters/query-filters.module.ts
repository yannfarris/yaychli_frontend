import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueryFiltersRoutingModule } from './query-filters-routing.module';
import { QueryFiltersComponent } from './query-filters.component';
import { StatusFilterComponent } from './status-filter/status-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SortFilterComponent } from './sort-filter/sort-filter.component';
import { AccountTypeFilterComponent } from './account-type-filter/account-type-filter.component';
import { AccountantTypeFilterComponent } from './accountant-type-filter/accountant-type-filter.component';
import { HideOldFilterComponent } from './hide-old-filter/hide-old-filter.component';

let comps = [
  QueryFiltersComponent,
  StatusFilterComponent
]
@NgModule({
  declarations: [
    comps,
    DateFilterComponent,
    SortFilterComponent,
    AccountTypeFilterComponent,
    AccountantTypeFilterComponent,
    HideOldFilterComponent
  ],
  imports: [
    CommonModule,
    // QueryFiltersRoutingModule,
    TranslateModule,
    InlineSVGModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,

  ],

  exports: [
    comps
  ]
})
export class QueryFiltersModule { }
