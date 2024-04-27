import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NombradosbService } from '../service/nombradosb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-nombradosb',
  templateUrl: './add-nombradosb.component.html',
  styleUrl: './add-nombradosb.component.scss'
})
export class AddNombradosbComponent {

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";

  public trabajadores: any[] = [];
  public selectedtrabajador: any = "";

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
  private idtipotrabajador = "6614de1572fa497e6831fdce";
  public nombrearchivo: string = "";

  public text_success:string = '';
  public text_validation:string = '';
  constructor(
    public nombradosbService: NombradosbService,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {

    this.nombradosbService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.nombradosbService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.nombradosbService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.nombradosbService.listTrabajador().subscribe((resp:any) => {
      this.trabajadores = resp.data;
    })

    this.selectedtipotrabajador = this.idtipotrabajador;

  }

  loadFile($event: any) {
    if ($event.target.files.length === 0 || $event.target.files[0].type !== 'application/pdf') {
        this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO PDF";
        return;
    }
    this.text_validation = '';
    
    const file = $event.target.files[0];
    this.selectedFileName = file.name;

    let reader = new FileReader();
    reader.onload = (event) => {
        const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
        this.buffer = arrayBuffer;
    };
    reader.readAsArrayBuffer(file);
  }

  save(){
    this.text_validation = '';
    if( !this.selectedMonth  ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (anio,mes,regimen,avatar)";
      return;
    }

    let formData = new FormData();
    formData.append("anio",this.selectedYear);
    formData.append("mes",this.selectedMonth);
    formData.append("tipotrabajador",this.selectedtipotrabajador);
    formData.append("trabajador",this.selectedtrabajador);
    formData.append("regimen",this.selectedregimen);
    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    this.nombradosbService.registrarBoleta(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'La boleta no se registró correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La boleta no se registró correctamente',
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
      title: 'La boleta se registró correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/nombradosb/list-nombradosb');
    });
  }

}

