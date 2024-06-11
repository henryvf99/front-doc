import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../service/roles.service';
import { DataService } from '../../../shared/data/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss']
})
export class AddRoleUserComponent implements OnInit{

  sideBar: any = [];
  nombre: string = '';
  permissions: any = [];
  valid_form: boolean = false;
  valid_form_success: boolean = false;
  text_validation: any = null;
  public user:any;

  constructor(
    public dataService: DataService,
    public roleService: RolesService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.user = this.roleService.authService.user;
  }

  data: any = {
    "gtrabajador": false,
    "ptrabajador": false,
    "utrabajador": false,
    "dtrabajador": false,
    "gpracticante": false,
    "ppracticante": false,
    "upracticante": false,
    "dpracticante": false,
    "gboleta": false,
    "pboleta": false,
    "uboleta": false,
    "dboleta": false,
    "gplanilla": false,
    "pplanilla": false,
    "uplanilla": false,
    "dplanilla": false,
    "semitidos": false,
    "gemitidos": false,
    "pemitidos": false,
    "uemitidos": false,
    "demitidos": false,
    "srecibidos": false,
    "grecibidos": false,
    "precibidos": false,
    "urecibidos": false,
    "drecibidos": false
  };

  isPermision(){
    if(this.user.rol.nombre.includes("ADMIN")){
      return true;
    }
    return false;
  }

  updateData(checkboxName: string, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.type === 'checkbox') {
      this.data[checkboxName] = target.checked;
    }
  }

  save(){
    this.text_validation = '';
    if( !this.nombre  ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (nombre)";
      return;
    }

    this.data['nombre'] = this.nombre;

    console.log(this.data);

    this.roleService.registrarPermisos(this.data).subscribe((res:any) => {

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
