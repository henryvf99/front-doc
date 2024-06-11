import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemorandumeComponent } from './memorandume.component';
import { AddMemorandumeComponent } from './add-memorandume/add-memorandume.component';
import { ListMemorandumeComponent } from './list-memorandume/list-memorandume.component';
import { EditMemorandumeComponent } from './edit-memorandume/edit-memorandume.component';

const routes: Routes = [{
  path: '',
  component: MemorandumeComponent,
  children: [
    {
      path: 'add-memorandume',
      component: AddMemorandumeComponent
    },
    {
      path: 'list-memorandume',
      component: ListMemorandumeComponent
    },
    {
      path: 'edit-memorandume/:id',
      component: EditMemorandumeComponent
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemorandumeRoutingModule { }
