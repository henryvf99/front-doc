import { Component } from '@angular/core';
import { ProveidosService } from '../service/proveidos.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-edit-proveidos',
  templateUrl: './edit-proveidos.component.html',
  styleUrl: './edit-proveidos.component.scss'
})

export class EditProveidosComponent {

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
  public documento_id:any;
  public documento_selected: any;

  public codigo: string = "";
  public destinatario: string = "";
  public asunto: string = "";
  public fechaemision: string = "";
  

  public nombrearchivo: string = "";
  public nombrearchivo2: string = "";

  public text_success:string = '';
  public text_validation:string = '';

  public proveidos_id:any;
  public proveidos_selected:any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public proveidosService: ProveidosService,
    public activedRoute: ActivatedRoute,
    public authService: AuthService,
    public userService: StaffService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.proveidosService.authService.user.id;
    this.listUser(this.user_id);

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.documento_id = resp.id;
    })
   
    this.proveidosService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.proveidosService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.proveidosService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.proveidosService.listEmitidosById(this.documento_id).subscribe((resp:any) => {
      console.log(resp);
      this.documento_selected = resp.data;
      this.selectedYear = this.documento_selected.anio.id;
      this.selectedMonth = this.documento_selected.mes.id;
      this.selectedtipodocumento = this.documento_selected.tipodocumento.id;
      this.codigo = this.documento_selected.codigo;
      this.destinatario = this.documento_selected.destinatario ;
      this.asunto = this.documento_selected.asunto;
      this.fechaemision = this.documento_selected.fechaemision ;
      this.selectedFileName = this.documento_selected.nombrearchivo || " ";
      this.selectedFileName2 = this.documento_selected.nombrearchivo2 || " ";
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
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipodocumento || !this.codigo || !this.destinatario || !this.asunto || !this.fechaemision ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de documento, Código, Destinatario, Asunto y Fecha de emisión)";
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

    formData.append("nombrearchivo",this.selectedFileName || "");
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    formData.append("nombrearchivo2",this.selectedFileName2);
    if (this.buffer2 !== null) {
      formData.append("file2", new Blob([this.buffer2]));
    }
    
    this.proveidosService.updateEmitidos(this.documento_id,formData).subscribe((resp:any) => {
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
      this.router.navigateByUrl('/proveidos/list-proveidos');
    });
  }

}

