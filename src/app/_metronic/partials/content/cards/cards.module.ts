import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { Card1Component } from './card1/card1.component';
import { Card2Component } from './card2/card2.component';
import { Card3Component } from './card3/card3.component';
import { Card4Component } from './card4/card4.component';
import { Card5Component } from './card5/card5.component';
import { UserListComponent } from './user-list/user-list.component';
import { DropdownMenusModule } from '../dropdown-menus/dropdown-menus.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { FieldModalModule } from 'src/app/shared/modules/field-modal/field-modal.module';

@NgModule({
  declarations: [
    Card1Component,
    Card2Component,
    Card3Component,
    Card4Component,
    Card5Component,
    UserListComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    NgbTooltipModule,
    DropdownMenusModule,
    TranslateModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    FieldModalModule
  ],
  exports: [
    Card1Component,
    Card2Component,
    Card3Component,
    Card4Component,
    Card5Component,
    UserListComponent,
  ],
})
export class CardsModule {}
