import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-staff-n',
  templateUrl: './add-staff-n.component.html',
  styleUrls: ['./add-staff-n.component.scss']
})
export class AddStaffNComponent {

  public selectedValue !: string  ;
  public name:string = '';
  public surname:string = '';
  public email:string = '';
  public password:string = '';
  public password_confirmation:string = '';
  public passwordClass = false;
  public area:string = '';
  public roles:any = [];

  public FILE_aceptacion:any;
  public FILE_certificado:any;
  
  public text_success:string = '';
  public text_validation:string = '';

  constructor(public staffService: StaffService) {
    
  }
  ngOnInit(): void {

    this.staffService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.roles = resp.roles;
    })
  }

  save(){
    this.text_validation = '';
    if(!this.name || !this.email || !this.surname || !this.password || !this.password_confirmation){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Todos los campos son obligatorios)";
      return;
    }

    if(this.password != this.password_confirmation){
      this.text_validation = "LAS CONTRASEÑA DEBEN SER IGUALES";
      return;
    }
    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("area",this.area);
    formData.append("password",this.password);
    formData.append("role_id",this.selectedValue);

    this.staffService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'El usuario ha sido registrado correctamente';

        this.name = '';
        this.surname = '';
        this.email  = '';
        this.area  = '';
        this.password  = '';
        this.password_confirmation  = '';
        this.selectedValue  = '';
        
        this.FILE_aceptacion = null;
        this.FILE_certificado = null;      }

    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se agregó Correctamente',
      showConfirmButton: false,
      timer: 1500
    });

  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
  loadFile($event: any, type: string): void {
    const allowedTypes = ['image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if ($event.target.files.length === 0) {
      this.text_validation = "POR FAVOR, SELECCIONE UN ARCHIVO";
      return;
    }

    const files = $event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (allowedTypes.indexOf(file.type) === -1) {
            this.text_validation = "SOLAMENTE SE PERMITEN ARCHIVOS DE TIPO IMAGEN, WORD, PDF O EXCEL";
            return;
        }

        if (type === 'aceptacion') {
            this.FILE_aceptacion = file;
        } else if (type === 'certificado') {
            this.FILE_certificado = file;
        }
    }

    this.text_validation = '';
}

}
