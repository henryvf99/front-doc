import { Component } from '@angular/core';
import { CasdirectivosbService } from '../service/casdirectivosb.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-casdirectivosb',
  templateUrl: './edit-casdirectivosb.component.html',
  styleUrl: './edit-casdirectivosb.component.scss'
})
export class EditCasdirectivosbComponent {

  public selectedValue !: string  ;
  public anio:string = '';
  public mes:string = '';
  public tipotrabajador:string = '';
  public regimen:string = '';

  public FILE_AVATAR:any;

  public text_success:string = '';
  public text_validation:string = '';

  public casdirectivosb_id:any;
  public casdirectivosb_selected:any;
  constructor(
    public casdirectivosbService: CasdirectivosbService,
    public activedRoute: ActivatedRoute
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.casdirectivosb_id = resp.id;
    })
    
    this.casdirectivosb_selected.showUser(this.casdirectivosb_id).subscribe((resp:any) => {
      console.log(resp);
      this.casdirectivosb_selected = resp.user;

      this.selectedValue = this.casdirectivosb_selected.role.id;
      this.anio = this.casdirectivosb_selected.anio ;
      this.mes = this.casdirectivosb_selected.mes ;
      this.tipotrabajador = this.casdirectivosb_selected.tipotrabajador ;
      this.regimen = this.casdirectivosb_selected.regimen ;

    })

    this.casdirectivosb_selected.listConfig().subscribe((resp:any) => {
      console.log(resp);
    })
  }

  save(){
    this.text_validation = '';
    if(!this.anio || !this.regimen || !this.mes){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (anio,mes,regimen)";
      return;
    }

    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("anio",this.anio);
    formData.append("mes",this.mes);
    formData.append("regimen",this.regimen);
    formData.append("tipotrabajador",this.tipotrabajador);
    
    formData.append("role_id",this.selectedValue);
    if(this.FILE_AVATAR){
      formData.append("imagen",this.FILE_AVATAR);
    }
    
    this.casdirectivosb_selected.updateUser(this.casdirectivosb_id,formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'El usuario ha editado correctamente';
      }

    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se modificó Correctamente',
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

