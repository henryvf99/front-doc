import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemorandumRoutingModule } from './memorandum-routing.module';
import { AddMemorandumComponent } from './add-memorandum/add-memorandum.component';
import { EditMemorandumComponent } from './edit-memorandum/edit-memorandum.component';
import { ListMemorandumComponent } from './list-memorandum/list-memorandum.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MemorandumComponent } from './memorandum.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AddMemorandumComponent,
    EditMemorandumComponent,
    ListMemorandumComponent,
    MemorandumComponent
  ],
  imports: [
    CommonModule,
    MemorandumRoutingModule,
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
export class MemorandumModule { }
