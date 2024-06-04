import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../service/roles.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/data/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-role-user',
  templateUrl: './edit-role-user.component.html',
  styleUrls: ['./edit-role-user.component.scss']
})
export class EditRoleUserComponent {

  sideBar:any = [];
  nombre: string = '';
  permissions:any = [];
  valid_form: boolean = false;
  valid_form_success: boolean = false;
  text_validation:any = null;

  role_id: any;
  role_data: any;
  
  constructor(
    public dataService: DataService ,
    public roleService: RolesService,
    public activedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }
  ngOnInit() {

    this.activedRoute.params.subscribe((resp:any) => {
      this.role_id = resp.id;
    });

    this.roleService.listPermisosById(this.role_id).subscribe((resp: any) => {
      this.role_data = resp.data;
      this.nombre = resp.data.nombre;
    })

  }

  updateData(checkboxName: string, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.type === 'checkbox') {
      this.role_data[checkboxName] = target.checked;
    }
  }

  save(){
    this.text_validation = '';
    if( !this.nombre  ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (nombre)";
      return;
    }

    this.role_data['nombre'] = this.nombre;

    console.log(this.role_data);

    this.roleService.updatePermisos(this.role_id, this.role_data).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El permiso no se registro correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }

    },
    (err: any) => {
      var msj = err.error.message;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: msj,
        showConfirmButton: true
      });
    }
    );
    
  }

  mostrarMensajeDeExito() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El permiso  se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/roles/list');
    });
  }
  
}
