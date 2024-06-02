import { Component } from '@angular/core';
import { FuncionariosService } from '../service/funcionarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adit-funcionarios',
  templateUrl: './adit-funcionarios.component.html',
  styleUrl: './adit-funcionarios.component.scss'
})
export class AditFuncionariosComponent {
  
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

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public funcionariosService: FuncionariosService,
    public activedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.activedRoute.params.subscribe((resp:any) => { 
      this.trabajador_id = resp.id;
      console.log(this.trabajador_id);
    })
    
    this.funcionariosService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.funcionariosService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.funcionariosService.listCargo().subscribe((resp:any) => {
      this.cargos = resp.data;
    })

    this.funcionariosService.listTrabajadorById(this.trabajador_id).subscribe((resp:any) => {
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

  save(){
    this.text_validation = '';
    if( !this.selectedarea  ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (anio,mes,regimen,avatar)";
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
    
    this.funcionariosService.updateTrabajador(this.trabajador_id, data).subscribe((res:any) => {

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
      this.router.navigateByUrl('/funcionarios/list-funcionarios');
    });
  }

}
