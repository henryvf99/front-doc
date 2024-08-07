import { Component } from '@angular/core';
import { MemorandumService } from '../service/memorandum.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-edit-memorandum',
  templateUrl: './edit-memorandum.component.html',
  styleUrl: './edit-memorandum.component.scss'
})
export class EditMemorandumComponent {

  public year: any;
  
  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipodocumentos: any[] = [];
  public selectedtipodocumento: any = "";
  
  private idtipodocumento = "6614e0f772fa497e6831fdf6";
  public documento_id:any;
  public documento_selected: any;

  public codigo: string = "";
  public asunto: string = "";
  public fecharecepcion: string = "";
  public nombrearchivo: string = " ";

  public text_success:string = '';
  public text_validation:string = '';

  public memorandum_id:any;
  public memorandum_selected:any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public memorandumService: MemorandumService,
    public activedRoute: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public userService: StaffService
  ) {
    
  }
  ngOnInit(): void {

    this.user_id = this.memorandumService.authService.user.id;
    this.listUser(this.user_id);
    
    this.activedRoute.params.subscribe((resp:any) => {
      
      this.documento_id = resp.id;
    })
    
    this.memorandumService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.memorandumService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.memorandumService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.memorandumService.listRecibidosById(this.documento_id).subscribe((resp:any) => {
      
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

  updateDateRange(){
      
    this.authService.listYearById(this.selectedYear).subscribe((resp:any) => {
      
      if(resp.success){
        this.year = resp.data;
        this.fecharecepcion = `${this.year.nombre}-01-01`;
      }
      
    });
      
  }

  save(){
    this.text_validation = '';
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipodocumento || !this.codigo || !this.asunto || !this.fecharecepcion ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de documento, Código, Asunto y Fecha de recepción)";
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
    
    this.memorandumService.updateRecibidos(this.documento_id,formData).subscribe((resp:any) => {
      

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
      this.router.navigateByUrl('/memorandum/list-memorandum');
    });
  }

}

