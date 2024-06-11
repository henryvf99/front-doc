import { Component } from '@angular/core';
import { ActivosService } from '../service/activos.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-adit-activos',
  templateUrl: './adit-activos.component.html',
  styleUrl: './adit-activos.component.scss'
})
export class AditActivosComponent {
  
  public nombres:string = '';
  public apellidos:string = '';
  public dni:string = '';
  public fnacimiento: string = '';
  public fingreso:string = '';
  public fsalida:string = '';

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";
  public areas: any[] = [];
  public selectedarea: any = "";
  public cargos: any[] = [];
  public selectedcargo: any = "";

  public regimenes: any[] = [
    {
      nombre: "276"
    },
    {
      nombre: "728"
    },
    {
      nombre: "1057"
    }
  ]

  public selectedregimen: any = "";
  public trabajador_id: any;
  public trabajador_data: any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public activosService: ActivosService,
    public activedRoute: ActivatedRoute,
    private router: Router,
    public service: AuthService,
    public userService: StaffService
  ) {
    
  }
  ngOnInit(): void {

    this.user_id = this.activosService.authService.user.id;
    this.listUser(this.user_id);

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.trabajador_id = resp.id;
    })
    
    this.activosService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.activosService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.activosService.listCargo().subscribe((resp:any) => {
      this.cargos = resp.data;
    })

    this.activosService.listTrabajadorById(this.trabajador_id).subscribe((resp:any) => {
      this.trabajador_data = resp.data;
      this.selectedregimen = this.trabajador_data.regimen;
      this.selectedtipotrabajador = this.trabajador_data.tipotrabajador.id;
      this.nombres = this.trabajador_data.nombres;
      this.apellidos = this.trabajador_data.apellidos;
      this.dni = this.trabajador_data.dni;
      this.fnacimiento = this.trabajador_data.fnacimiento;
      this.selectedarea = this.trabajador_data.area.id;
      this.selectedcargo = this.trabajador_data.cargo.id;
      this.fingreso = this.trabajador_data.fingreso;
      this.fsalida = this.trabajador_data.fsalida;
    })

  }

  listUser(user_id: string){
    this.userService.listUserById(user_id).subscribe((resp:any) => {
      console.log(resp);
      this.permiso_id = resp.data.permisos.id;
      this.listPermisos(this.permiso_id);
    })
  }

  listPermisos(id: string){
    this.service.getProfile(id).subscribe((resp:any) => {
      console.log(resp);
      this.permisos = resp.data;
    })
  }

  save(){
    this.text_validation = '';
    if( !this.selectedtipotrabajador || !this.selectedregimen || !this.nombres || !this.apellidos || !this.dni || !this.fnacimiento || !this.selectedarea || !this.selectedcargo || !this.fingreso ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Tipo trabajador, Régimen, Nombres, Apellidos, DNI, Fecha de nacimiento, Área, Cargo y Fecha de ingreso)";
      return;
    }

    const data = {
      tipotrabajador : this.selectedtipotrabajador.toString(),
      regimen : this.selectedregimen.toString(),
      nombres : this.nombres.toString(),
      apellidos : this.apellidos.toString(),
      dni : this.dni.toString(),
      fnacimiento : this.fnacimiento.toString(),
      area : this.selectedarea.toString(),
      cargo : this.selectedcargo.toString(),
      fingreso : this.fingreso.toString(),
      fsalida : this.fsalida.toString() || "-"
    };
    
    this.activosService.updateTrabajador(this.trabajador_id, data).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El trabajador no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El trabajador no se actualizó correctamente',
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
      title: 'El trabajador  se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/activos/list-activos');
    });
  }

}
