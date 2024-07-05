import { Component, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../shared/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { StaffService } from '../staff/service/staff.service';
import { SumarizacionService } from './service/sumarizacion.service';

@Component({
  selector: 'app-sumarizacion',
  templateUrl: './sumarizacion.component.html',
  styleUrl: './sumarizacion.component.scss'
})
export class SumarizacionComponent {

  @ViewChild('contenidoModal') contenidoModal!: TemplateRef<any>;
  dialogRef: MatDialogRef<any> | undefined;

  public buffer: ArrayBuffer | null = null;
  public selectedFileName: string = '';
  public buffer2: ArrayBuffer | null = null;
  public selectedFileName2: string = ''; 
  public text_validation:string = '';
  public isButtonDisabled: boolean = true;
  public isButtonDisabled2: boolean = true;
  public modal_txtarea = false;
  public modal_loading = false;
  public nombre_archivo_sumarizado: string = "";
  public texto_archivo_sumarizado: string = "";

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public service: SumarizacionService,
    public authService: AuthService,
    public userService: StaffService,
    private dialog: MatDialog
  ){

  }

  ngOnInit() {
    this.user_id = this.service.authService.user.id;
    this.listUser(this.user_id);
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
    this.isButtonDisabled = false;
  }

  loadFile2($event: any) {
    if ($event.target.files.length === 0 || $event.target.files[0].type !== 'application/pdf') {
        this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO PDF";
        return;
    }
    this.text_validation = '';
    
    const file = $event.target.files[0];
    this.selectedFileName2 = file.name;

    let reader = new FileReader();
    reader.onload = (event) => {
        const arrayBuffer = (event.target as FileReader).result as ArrayBuffer;
        this.buffer2 = arrayBuffer;
    };
    reader.readAsArrayBuffer(file);
    this.isButtonDisabled2 = false;
  }

  extractTextFromPdf(){

    this.modal_txtarea = false;
    this.modal_loading = false;
    this.texto_archivo_sumarizado = "";
    this.nombre_archivo_sumarizado = "";

    this.dialogRef = this.dialog.open(this.contenidoModal, {
      width: '80%',
      height: '70%'
    });

    let formData = new FormData();
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    this.authService.traducirPdfTexto(formData).subscribe((res:any) => {

      if(res.success){
        this.nombre_archivo_sumarizado = this.selectedFileName;
        this.texto_archivo_sumarizado = res.data;
        this.modal_loading = true;
        this.modal_txtarea = true;

        this.resetFileInput();
        
      }else{
        console.log(`Error`);
      }

    });

  }

  extractTextFromPdf2(){

    this.modal_txtarea = false;
    this.modal_loading = false;
    this.texto_archivo_sumarizado = "";
    this.nombre_archivo_sumarizado = "";

    this.dialogRef = this.dialog.open(this.contenidoModal, {
      width: '80%',
      height: '70%'
    });

    let formData = new FormData();
    if (this.buffer2 !== null) {
      formData.append("file", new Blob([this.buffer2]));
    }

    this.authService.traducirPdfTextoOcr(formData).subscribe((res:any) => {

      if(res.success){
        this.nombre_archivo_sumarizado = this.selectedFileName;
        this.texto_archivo_sumarizado = res.data;
        this.modal_loading = true;
        this.modal_txtarea = true;

        this.resetFileInput();
        
      }else{
        console.log(`Error`);
      }

    });

  }

  cerrarModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.modal_txtarea = false;
      this.modal_loading = false;
      this.texto_archivo_sumarizado = "";
      this.nombre_archivo_sumarizado = "";
      this.isButtonDisabled = true;
      this.isButtonDisabled2 = true;
    }
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.isButtonDisabled = true;
      this.selectedFileName = '';
      this.isButtonDisabled2 = true;
      this.selectedFileName2 = '';
    }
  }

}