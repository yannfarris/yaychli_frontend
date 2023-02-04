import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLiteComponent } from './dashboard-lite.component';

const routes: Routes = [{ path: '', component: DashboardLiteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardLiteRoutingModule { }
