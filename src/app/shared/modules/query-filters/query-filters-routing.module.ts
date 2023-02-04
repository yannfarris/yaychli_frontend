import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryFiltersComponent } from './query-filters.component';

const routes: Routes = [{ path: '', component: QueryFiltersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryFiltersRoutingModule { }
