import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocdiversosRoutingModule } from './docdiversos-routing.module';
import { AddDocdiversosComponent } from './add-docdiversos/add-docdiversos.component';
import { EditDocdiversosComponent } from './edit-docdiversos/edit-docdiversos.component';
import { ListDocdiversosComponent } from './list-docdiversos/list-docdiversos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { DocdiversosComponent } from './docdiversos.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AddDocdiversosComponent,
    EditDocdiversosComponent,
    ListDocdiversosComponent,
    DocdiversosComponent
  ],
  imports: [
    CommonModule,
    DocdiversosRoutingModule,
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
export class DocdiversosModule { }
