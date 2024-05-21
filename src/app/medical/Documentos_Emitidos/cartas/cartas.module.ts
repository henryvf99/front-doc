import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartasRoutingModule } from './cartas-routing.module';
import { AddCartasComponent } from './add-cartas/add-cartas.component';
import { EditCartasComponent } from './edit-cartas/edit-cartas.component';
import { ListCartasComponent } from './list-cartas/list-cartas.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CartasComponent } from './cartas.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AddCartasComponent,
    EditCartasComponent,
    ListCartasComponent,
    CartasComponent
  ],
  imports: [
    CommonModule,
    CartasRoutingModule,
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
export class CartasModule { }
