import { Component } from '@angular/core';
import { DocdiversosService } from '../service/docdiversos.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-docdiversos',
  templateUrl: './edit-docdiversos.component.html',
  styleUrl: './edit-docdiversos.component.scss'
})
export class EditDocdiversosComponent {

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipodocumentos: any[] = [];
  public selectedtipodocumento: any = "";
  
  private idtipodocumento = "6614e1a272fa497e6831fe12";
  public documento_id:any;
  public documento_selected: any;

  public codigo: string = "";
  public asunto: string = "";
  public fecharecepcion: string = "";
  public nombrearchivo: string = " ";

  public text_success:string = '';
  public text_validation:string = '';

  public docdiversos_id:any;
  public docdiversos_selected:any;

  constructor(
    public docdiversosService: DocdiversosService,
    public activedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.documento_id = resp.id;
    })
    
    this.docdiversosService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.docdiversosService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.docdiversosService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.docdiversosService.listRecibidosById(this.documento_id).subscribe((resp:any) => {
      console.log(resp);
      this.documento_selected = resp.data;
      this.selectedYear = this.documento_selected.anio.id;
      this.selectedMonth = this.documento_selected.mes.id;
      this.selectedtipodocumento = this.documento_selected.tipodocumento.id;
      this.codigo = this.documento_selected.codigo;
      this.asunto = this.documento_selected.asunto;
      this.fecharecepcion = this.documento_selected.fecharecepcion ;
      this.selectedFileName = this.documento_selected.nombrearchivo || " ";
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
    if(!this.selectedYear || !this.selectedMonth || !this.selectedtipodocumento){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (anio,mes,regimen)";
      return;
    }

    let formData = new FormData();
    formData.append("anio",this.selectedYear);
    formData.append("mes",this.selectedMonth);
    formData.append("tipodocumento",this.selectedtipodocumento);

    formData.append("codigo",this.codigo);
    formData.append("asunto",this.asunto);
    formData.append("fecharecepcion",this.fecharecepcion);

    formData.append("nombrearchivo",this.selectedFileName || "");
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }
    
    this.docdiversosService.updateRecibidos(this.documento_id,formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.success){
        this.text_validation = resp.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El documento no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El documento no se actualizó correctamente',
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
    });
  }

  mostrarMensajeDeExito() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El documento se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/docdiversos/list-docdiversos');
    });
  }

}

