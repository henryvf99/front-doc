import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExfuncionariosService } from '../service/exfuncionarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-exfuncionarios',
  templateUrl: './add-exfuncionarios.component.html',
  styleUrl: './add-exfuncionarios.component.scss'
})
export class AddExfuncionariosComponent implements OnInit{

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

  private idtipotrabajador = "665bf9d2ebd95110d2cd5e62";
  public selectedregimen: any = "";

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public exfuncionariosService: ExfuncionariosService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    
    this.exfuncionariosService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.exfuncionariosService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.exfuncionariosService.listCargo().subscribe((resp:any) => {
      this.cargos = resp.data;
    })

    this.selectedtipotrabajador = this.idtipotrabajador;

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
    console.log(data);
    this.exfuncionariosService.registrarTrabajador(data).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El trabajador no se registro correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El trabajador no se registro correctamente',
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
      title: 'El trabajador  se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/exfuncionarios/list-exfuncionarios');
    });
  }

}
