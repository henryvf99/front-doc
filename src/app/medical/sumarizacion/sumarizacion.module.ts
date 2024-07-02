import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SumarizacionComponent } from './sumarizacion.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { SumarizacionRoutingModule } from './sumarizacion-routing.module';
import { SumArchivoComponent } from './sum-archivo/sum-archivo.component';


@NgModule({
  declarations: [
    SumarizacionComponent,
    SumArchivoComponent
  ],
  imports: [
    CommonModule,
    SumarizacionRoutingModule,
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
export class SumarizacionModule { }
