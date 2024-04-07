import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CesanteService } from '../service/cesante.service';

@Component({
  selector: 'app-add-cesante',
  templateUrl: './add-cesante.component.html',
  styleUrl: './add-cesante.component.scss'
})
export class AddCesanteComponent {

  public selectedValue !: string  ;
  public nombres:string = '';
  public apellidos:string = '';
  public dni:string = '';

  public fingreso:string = '';
  public fsalida:string = '';

  public FILE_AVATAR:any;

  public text_success:string = '';
  public text_validation:string = '';
  constructor(
    public cesanteService: CesanteService,
  ) {
    
  }
  ngOnInit(): void {

    this.cesanteService.listConfig().subscribe((resp:any) => {
      console.log(resp);
    })
  }

  save(){
    this.text_validation = '';
    if(!this.nombres || !this.apellidos){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Nombres,Apellidos)";
      return;
    }
    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("nombres",this.nombres);
    formData.append("apellidos",this.apellidos);
    formData.append("dni",this.dni);
    formData.append("fingreso",this.fingreso);
    formData.append("fsalida",this.fsalida);

    formData.append("imagen",this.FILE_AVATAR);
    
    this.cesanteService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'El usuario ha sido registrado correctamente';

        this.nombres = '';
        this.apellidos = '';
        this.dni  = '';
        this.fingreso  = '';
        this.fsalida  = '';

        this.selectedValue  = '';
        this.FILE_AVATAR = null;
      }

    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se registró Correctamente',
      showConfirmButton: false,
      timer: 1500
    });

  }

  loadFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      // alert("SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN");
      this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO IMAGEN";
      return;
    }
    this.text_validation = '';
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
  }
}
