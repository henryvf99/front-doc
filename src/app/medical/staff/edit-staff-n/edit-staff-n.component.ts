import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../service/staff.service';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-edit-staff-n',
  templateUrl: './edit-staff-n.component.html',
  styleUrls: ['./edit-staff-n.component.scss']
})

export class EditStaffNComponent {

  public email:string = '';
  public password:string = '';
  public nombres:string = '';
  public apellidos: string = '';

  public permisos: any[] = [];
  public selectedpermisos: any = "";
  public areas: any[] = [];
  public selectedarea: any = "";
  public roles: any[] = [];
  public selectedrol: any = "";

  public user_id: any;
  public user_data: any;
  public user: any;
  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public staffService: StaffService,
    public activedRoute: ActivatedRoute,
    public router: Router
  ) {
    
  }

 ngOnInit(): void {

  this.user = this.staffService.authService.user;

  this.activedRoute.params.subscribe((resp:any) => {
    
    this.user_id = resp.id;
  })
    
    this.staffService.listPermisos().subscribe((resp:any) => {
      this.permisos = resp.data;
    })

    this.staffService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.staffService.listRol().subscribe((resp:any) => {
      this.roles = resp.data;
    })

    this.staffService.listUserById(this.user_id).subscribe((resp:any) => {
      this.user_data = resp.data;
      this.email = this.user_data.email;
      //this.password = this.user_data.password;
      this.nombres = this.user_data.nombres;
      this.apellidos = this.user_data.apellidos;
      this.selectedarea = this.user_data.area.id;
      this.selectedrol = this.user_data.rol.id;
      this.selectedpermisos = this.user_data.permisos.id;
    })

  }

  isPermision(){
    if(this.user.rol.nombre.includes("ADMIN")){
      return true;
    }
    return false;
  }

  async save(){
    this.text_validation = '';
    if( !this.email && !this.password && !this.nombres && !this.apellidos && !this.selectedarea && !this.selectedrol && !this.selectedpermisos ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Nombres, Apellidos, Email, Contraseña, Área, Rol y Permisos)";
      return;
    }

    const data: { [key: string]: any } = {
      email: this.email.toString(),
      nombres: this.nombres.toString(),
      apellidos: this.apellidos.toString(),
      area: this.selectedarea.toString(),
      rol: this.selectedrol.toString(),
      permisos: this.selectedpermisos.toString()
    };

    if (this.password && this.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      data['password'] = hash;
    }


    this.staffService.updateUser(this.user_id, data).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El usuario no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario no se actualizó correctamente',
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
      title: 'El usuario  se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/staffs/list-staff');
    });
  }

}
