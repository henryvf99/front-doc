import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SumarizacionComponent } from './sumarizacion.component';

const routes: Routes = [{
  path: '',
  component: SumarizacionComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SumarizacionRoutingModule { }
