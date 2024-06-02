import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CesanteService } from '../service/cesante.service';

@Component({
  selector: 'app-add-cesante',
  templateUrl: './add-cesante.component.html',
  styleUrl: './add-cesante.component.scss'
})
export class AddCesanteComponent implements OnInit{

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

  private idtipotrabajador = "66234c4676fc363243ddb9dc";
  public selectedregimen: any = "";

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public cesanteService: CesanteService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    
    this.cesanteService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.cesanteService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

    this.cesanteService.listCargo().subscribe((resp:any) => {
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
    this.cesanteService.registrarTrabajador(data).subscribe((res:any) => {

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
      this.router.navigateByUrl('/cesantes/list-cesante');
    });
  }

}
