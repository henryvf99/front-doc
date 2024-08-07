import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasdirectivosbRoutingModule } from './casdirectivosb-routing.module';
import { AddCasdirectivosbComponent } from './add-casdirectivosb/add-casdirectivosb.component';
import { EditCasdirectivosbComponent } from './edit-casdirectivosb/edit-casdirectivosb.component';
import { ListCasdirectivosbComponent } from './list-casdirectivosb/list-casdirectivosb.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CasdirectivosbComponent } from './casdirectivosb.component';
import { MatIconModule } from '@angular/material/icon';


import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    AddCasdirectivosbComponent,
    EditCasdirectivosbComponent,
    ListCasdirectivosbComponent,
    CasdirectivosbComponent
  ],
  imports: [
    CommonModule,
    CasdirectivosbRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDatepickerModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class CasdirectivosbModule { }
