import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemorandumeRoutingModule } from './memorandume-routing.module';
import { AddMemorandumeComponent } from './add-memorandume/add-memorandume.component';
import { EditMemorandumeComponent } from './edit-memorandume/edit-memorandume.component';
import { ListMemorandumeComponent } from './list-memorandume/list-memorandume.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MemorandumeComponent } from './memorandume.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AddMemorandumeComponent,
    EditMemorandumeComponent,
    ListMemorandumeComponent,
    MemorandumeComponent
  ],
  imports: [
    CommonModule,
    MemorandumeRoutingModule,
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
export class MemorandumeModule { }
