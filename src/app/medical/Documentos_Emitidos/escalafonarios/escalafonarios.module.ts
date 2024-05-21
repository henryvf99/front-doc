import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscalafonariosRoutingModule } from './escalafonarios-routing.module';
import { AddEscalafonariosComponent } from './add-escalafonarios/add-escalafonarios.component';
import { EditEscalafonariosComponent } from './edit-escalafonarios/edit-escalafonarios.component';
import { ListEscalafonariosComponent } from './list-escalafonarios/list-escalafonarios.component';
import { EscalafonariosComponent } from './escalafonarios.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AddEscalafonariosComponent,
    EditEscalafonariosComponent,
    ListEscalafonariosComponent,
    EscalafonariosComponent
  ],
  imports: [
    CommonModule,
    EscalafonariosRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDatepickerModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class EscalafonariosModule { }
