import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatMenuModule} from '@angular/material/menu';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {A11yModule} from '@angular/cdk/a11y';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';



const md =  [
  MatButtonModule,
  MatDialogModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  MatAutocompleteModule,
  MatSelectModule,
  ScrollingModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatMenuModule,
  TextFieldModule,
  MatRippleModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSnackBarModule,
  A11yModule,
  MatCheckboxModule,
  MatRadioModule
  
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    md
  ],
  exports:[
    md
  ]
})
export class MdModule { }
