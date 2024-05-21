import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResogerencialRoutingModule } from './resogerencial-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ResogerencialComponent } from './resogerencial.component';
import { ListResogerencialComponent } from './list-resogerencial/list-resogerencial.component';
import { AddResogerencialComponent } from './add-resogerencial/add-resogerencial.component';
import { EditResogerencialComponent } from './edit-resogerencial/edit-resogerencial.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ListResogerencialComponent,
    AddResogerencialComponent,
    EditResogerencialComponent,
    ResogerencialComponent
  ],
  imports: [
    CommonModule,
    ResogerencialRoutingModule,
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
export class ResogerencialModule { }
