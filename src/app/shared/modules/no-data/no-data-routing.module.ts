import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoDataComponent } from './no-data.component';

const routes: Routes = [{ path: '', component: NoDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoDataRoutingModule { }
