import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemorandumeService } from '../service/memorandume.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-add-memorandume',
  templateUrl: './add-memorandume.component.html',
  styleUrl: './add-memorandume.component.scss'
})
export class AddMemorandumeComponent implements OnInit{
  
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
  
  private idtipodocumento = "6614e0f772fa497e6831fdf6";

  public codigo: string = "";
  public destinatario: string = "";
  public asunto: string = "";
  public fechaemision: string = "";
  

  public nombrearchivo: string = " ";
  public nombrearchivo2: string = " ";

  public text_success:string = '';
  public text_validation:string = '';

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public memorandumeService: MemorandumeService,
    public authService: AuthService,
    public userService: StaffService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.memorandumeService.authService.user.id;
    this.listUser(this.user_id);
    
    this.memorandumeService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.memorandumeService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.memorandumeService.listTipoDocumento().subscribe((resp:any) => {
      this.tipodocumentos = resp.data;
    })

    this.selectedtipodocumento = this.idtipodocumento;

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
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipodocumento || !this.codigo || !this.destinatario || !this.asunto || !this.fechaemision || !this.buffer2 ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de documento, Código, Destinatario, Asunto, Fecha de emisión y Documento)";
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

    this.memorandumeService.registrarEmitidos(formData).subscribe((res:any) => {

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
      this.router.navigateByUrl('/memorandume/list-memorandume');
    });
  }

}

