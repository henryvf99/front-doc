import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartasService } from '../service/cartas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-cartas',
  templateUrl: './add-cartas.component.html',
  styleUrl: './add-cartas.component.scss'
})
export class AddCartasComponent implements OnInit{
  
  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public selectedFileName2: string = ''; 
  public buffer2: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipodocumentos: any[] = [];
  public selectedtipodocumento: any = "";
  
  private idtipodocumento = "6614df0872fa497e6831fdea";

  public codigo: string = "";
  public destinatario: string = "";
  public asunto: string = "";
  public fechaemision: string = "";
  

  public nombrearchivo: string = " ";
  public nombrearchivo2: string = " ";

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public cartasService: CartasService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    
    this.cartasService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.cartasService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.cartasService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.selectedtipodocumento = this.idtipodocumento;

  }

  loadFile($event: any, inputNumber: number) {
    if ($event.target.files.length === 0 || $event.target.files[0].type !== 'application/pdf') {
        this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO PDF";
        return;
    }
    this.text_validation = '';
    
    const file = $event.target.files[0];
    const fileName = file.name;
    
    // Manejar el input 1
    if (inputNumber === 1) {
        this.selectedFileName = fileName;

        let reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
            this.buffer = arrayBuffer;
        };
        reader.readAsArrayBuffer(file);
    }
    // Manejar el input 2
    else if (inputNumber === 2) {
        this.selectedFileName2 = fileName;

        let reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
            this.buffer2 = arrayBuffer;
        };
        reader.readAsArrayBuffer(file);
    }
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
    formData.append("tipodocumento",this.selectedtipodocumento);

    formData.append("codigo",this.codigo);
    formData.append("destinatario",this.destinatario);
    formData.append("asunto",this.asunto);
    formData.append("fechaemision",this.fechaemision);

    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    formData.append("nombrearchivo2",this.selectedFileName2);
    if (this.buffer2 !== null) {
      formData.append("file2", new Blob([this.buffer2]));
    }

    this.cartasService.registrarEmitidos(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El documento no se registró correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El documento no se registró correctamente',
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
      title: 'El documento se registró correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/cartas/list-cartas');
    });
  }

}

