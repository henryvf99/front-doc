import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemorandumService } from '../service/memorandum.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-memorandum',
  templateUrl: './add-memorandum.component.html',
  styleUrl: './add-memorandum.component.scss'
})
export class AddMemorandumComponent implements OnInit{

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipodocumentos: any[] = [];
  public selectedtipodocumento: any = "";
  
  private idtipodocumento = "6614e0f772fa497e6831fdf6";

  public codigo: string = "";
  public asunto: string = "";
  public fecharecepcion: string = "";
  public nombrearchivo: string = " ";

  public text_success:string = '';
  public text_validation:string = '';
  constructor(
    public memorandumService: MemorandumService,
    private router: Router
  ) {
    
  }
  ngOnInit(): void {
    
    this.memorandumService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.memorandumService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.memorandumService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.selectedtipodocumento = this.idtipodocumento;

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
    formData.append("tipodocumento",this.selectedtipodocumento);

    formData.append("codigo",this.codigo);
    formData.append("asunto",this.asunto);
    formData.append("fecharecepcion",this.fecharecepcion);

    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    this.memorandumService.registrarRecibidos(formData).subscribe((res:any) => {

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
      title: 'El documento se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/memorandum/list-memorandum');
    });
  }

}

