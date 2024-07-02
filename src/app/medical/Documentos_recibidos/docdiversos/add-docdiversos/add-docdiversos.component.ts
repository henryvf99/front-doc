import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocdiversosService } from '../service/docdiversos.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-add-docdiversos',
  templateUrl: './add-docdiversos.component.html',
  styleUrl: './add-docdiversos.component.scss'
})
export class AddDocdiversosComponent implements OnInit{

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public year: any;
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipodocumentos: any[] = [];
  public selectedtipodocumento: any = "";
  
  private idtipodocumento = "6614e1a272fa497e6831fe12";

  public codigo: string = "";
  public asunto: string = "";
  public fecharecepcion: string = "";
  public nombrearchivo: string = " ";

  public text_success:string = '';
  public text_validation:string = '';

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public docdiversosService: DocdiversosService,
    private router: Router,
    public authService: AuthService,
    public userService: StaffService
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.docdiversosService.authService.user.id;
    this.listUser(this.user_id);
    
    this.docdiversosService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.docdiversosService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.docdiversosService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.selectedtipodocumento = this.idtipodocumento;

  }

  updateDateRange(){
      
    this.authService.listYearById(this.selectedYear).subscribe((resp:any) => {
      
      if(resp.success){
        this.year = resp.data;
        this.fecharecepcion = `${this.year.nombre}-01-01`;
      }
      
    });
      
  }

  listUser(user_id: string){
    this.userService.listUserById(user_id).subscribe((resp:any) => {
      this.permiso_id = resp.data.permisos.id;
      this.listPermisos(this.permiso_id);
    })
  }

  listPermisos(id: string){
    this.authService.getProfile(id).subscribe((resp:any) => {
      this.permisos = resp.data;
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
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipodocumento || !this.codigo || !this.asunto || !this.fecharecepcion || !this.buffer ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de documento, Código, Asunto, Fecha de recepción y Documento)";
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

    this.docdiversosService.registrarRecibidos(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El documento no se agregó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El documento no se agregó correctamente',
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
      title: 'El documento se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/docdiversos/list-docdiversos');
    });
  }
  
}

