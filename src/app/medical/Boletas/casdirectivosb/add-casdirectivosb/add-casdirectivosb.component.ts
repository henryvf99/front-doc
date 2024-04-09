import { Component, OnInit } from '@angular/core';
import { CasdirectivosbService } from '../service/casdirectivosb.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-casdirectivosb',
  templateUrl: './add-casdirectivosb.component.html',
  styleUrl: './add-casdirectivosb.component.scss'
})
export class AddCasdirectivosbComponent implements OnInit{

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";

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

  public text_success:string = '';
  public text_validation:string = '';
  constructor(
    public casdirectivosbService: CasdirectivosbService,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {

    this.casdirectivosbService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.casdirectivosbService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.casdirectivosbService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

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
    formData.append("regimen",this.selectedregimen);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    this.casdirectivosbService.registerUser(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'La boleta no se registro correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La boleta no se registro correctamente',
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
      title: 'La boleta se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/casdirectivosb/list-casdirectivosb');
    });
  }

}
