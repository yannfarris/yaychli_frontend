import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevsComponent } from './revs.component';

const routes: Routes = [{ path: '', component: RevsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevsRoutingModule { }
