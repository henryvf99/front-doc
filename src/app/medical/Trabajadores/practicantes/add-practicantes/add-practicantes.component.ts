import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PracticantesService } from '../service/practicantes.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-add-practicantes',
  templateUrl: './add-practicantes.component.html',
  styleUrl: './add-practicantes.component.scss'
})
export class AddPracticantesComponent implements OnInit{

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public selectedFileName2: string = ''; 
  public buffer2: ArrayBuffer | null = null;

  public areas: any[] = [];
  public selectearea: any = "";

  public nombre:string = '';
  public apellidos:string = '';
  public universidad:string = '';
  public horapracticas:string = '';
  public carrera:string = '';
  public fingreso:string = '';
  public fsalida:string = '';

  public text_success:string = '';
  public text_validation:string = '';

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public practicantesService: PracticantesService,
    private router: Router,
    public service: AuthService,
    public userService: StaffService
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.practicantesService.authService.user.id;
    this.listUser(this.user_id);
    
    this.practicantesService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })

  }

  listUser(user_id: string){
    this.userService.listUserById(user_id).subscribe((resp:any) => {
      this.permiso_id = resp.data.permisos.id;
      this.listPermisos(this.permiso_id);
    })
  }

  listPermisos(id: string){
    this.service.getProfile(id).subscribe((resp:any) => {
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
    if( !this.nombre || !this.apellidos || !this.universidad || !this.horapracticas || !this.selectearea || !this.carrera || !this.fingreso ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Nombres, Apellidos, Universidad, Horas de practicas, Área, Carrera y Fecha de ingreso)";
      return;
    }

    let formData = new FormData();
    formData.append("nombre",this.nombre);
    formData.append("apellidos",this.apellidos);
    formData.append("universidad",this.universidad);
    formData.append("horapracticas",this.horapracticas);
    formData.append("area",this.selectearea);
    formData.append("carrera",this.carrera);
    formData.append("fingreso",this.fingreso);
    formData.append("fsalida",this.fsalida || "-");

    formData.append("nombrearchivo",this.selectedFileName || "");
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    formData.append("nombrearchivo2",this.selectedFileName2 || "");
    if (this.buffer2 !== null) {
      formData.append("file2", new Blob([this.buffer2]));
    }

    this.practicantesService.registrarPracticante(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El practicante no se agregó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El practicante no se agregó correctamente',
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
      title: 'El practicante se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/practicantes/list-practicantes');
    });
  }

}
