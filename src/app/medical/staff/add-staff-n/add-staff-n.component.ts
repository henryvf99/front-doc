import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService } from '../service/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-staff-n',
  templateUrl: './add-staff-n.component.html',
  styleUrls: ['./add-staff-n.component.scss']
})
export class AddStaffNComponent implements OnInit{

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
  public user: any;
  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public staffService: StaffService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    
    this.user = this.staffService.authService.user;

    this.staffService.listPermisos().subscribe((resp:any) => {
      this.permisos = resp.data;
    })

    this.staffService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.staffService.listRol().subscribe((resp:any) => {
      this.roles = resp.data;
    })

  }

  isPermision(){
    if(this.user.rol.nombre.includes("ADMIN")){
      return true;
    }
    return false;
  }

  save(){
    this.text_validation = '';
    if( !this.email || !this.password || !this.nombres || !this.apellidos || !this.selectedarea || !this.selectedrol || !this.selectedpermisos ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Nombres, Apellidos, Email, Contraseña, Área, Rol y Permisos)";
      return;
    }

    const data = {
      email : this.email.toString(),
      password : this.password.toString(),
      nombres : this.nombres.toString(),
      apellidos : this.apellidos.toString(),
      area : this.selectedarea.toString(),
      rol : this.selectedrol.toString(),
      permisos : this.selectedpermisos.toString()
    };

    console.log(data);

    this.staffService.registrarUser(data).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El usuario no se registro correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario no se registro correctamente',
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
      title: 'El usuario  se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/staffs/list-staff');
    });
  }

}
