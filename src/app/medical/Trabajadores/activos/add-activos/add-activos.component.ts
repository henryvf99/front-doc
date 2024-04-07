import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivosService } from '../service/activos.service';

@Component({
  selector: 'app-add-activos',
  templateUrl: './add-activos.component.html',
  styleUrl: './add-activos.component.scss'
})
export class AddActivosComponent {
  public selectedValue !: string  ;
  public nombres:string = '';
  public apellidos:string = '';
  public dni:string = '';
  public area:string = '';
  public cargo:string = '';
  public regimen:string='';

  public fnacimiento: string = '';
  public fingreso:string = '';

  public FILE_documento:any;

  public text_success:string = '';
  public text_validation:string = '';
  constructor(
    public activosService: ActivosService,
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activosService.listConfig().subscribe((resp:any) => {
      console.log(resp);
    })
  }

  save(){
    this.text_validation = '';
    if(!this.nombres || !this.area || !this.apellidos || !this.FILE_documento ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (nombres,apellidos,area,documento)";
      return;
    }

    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("nombres",this.nombres);
    formData.append("apellidos",this.apellidos);
    formData.append("dni",this.dni);
    formData.append("area",this.area);
    formData.append("cargo",this.cargo);
    formData.append("regimen",this.cargo);

    formData.append("fnacimiento",this.fnacimiento);
    formData.append("fingreso",this.fingreso);
    formData.append("imagen",this.FILE_documento);
    
    this.activosService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'El usuario ha sido registrado correctamente';

        this.nombres = '';
        this.apellidos = '';
        this.dni  = '';
        this.area  = '';
        this.cargo  = '';
        this.regimen  = '';

        this.fnacimiento  = '';
        this.fingreso  = '';
        
        this.selectedValue  = '';
        this.FILE_documento = null;
      }

    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se agregó Correctamente',
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
    this.FILE_documento = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_documento);
  }
}
