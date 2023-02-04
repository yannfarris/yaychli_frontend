import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldSearchComponent } from './field-search.component';

const routes: Routes = [{ path: '', component: FieldSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FieldSearchRoutingModule { }
