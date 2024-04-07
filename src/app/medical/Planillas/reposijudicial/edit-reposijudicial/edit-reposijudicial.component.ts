import { Component } from '@angular/core';
import { ReposijudicialService } from '../service/reposijudicial.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-reposijudicial',
  templateUrl: './edit-reposijudicial.component.html',
  styleUrl: './edit-reposijudicial.component.scss'
})
export class EditReposijudicialComponent {

  public selectedValue !: string  ;
  public name:string = '';
  public surname:string = '';
  public mobile:string = '';
  public email:string = '';
  public password:string = '';
  public password_confirmation:string = '';

  public birth_date:string = '';
  public gender:number = 1;
  public education:string = '';
  public designation:string = '';
  public address:string = '';

  public roles:any = [];

  public FILE_AVATAR:any;
  public IMAGEN_PREVIZUALIZA:any = 'assets/img/user-06.jpg';

  public text_success:string = '';
  public text_validation:string = '';

  public reposijudicial_id:any;
  public reposijudicial_selected:any;
  constructor(
    public reposijudicialService: ReposijudicialService,
    public activedRoute: ActivatedRoute
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.reposijudicial_id = resp.id;
    })
    
    this.reposijudicial_selected.showUser(this.reposijudicial_id).subscribe((resp:any) => {
      console.log(resp);
      this.reposijudicial_selected = resp.user;

      this.selectedValue = this.reposijudicial_selected.role.id;
      this.name = this.reposijudicial_selected.name ;
      this.surname = this.reposijudicial_selected.surname ;
      this.mobile = this.reposijudicial_selected.mobile ;
      this.email = this.reposijudicial_selected.email ;
      this.birth_date = new Date(this.reposijudicial_selected.birth_date).toISOString();
      this.gender = this.reposijudicial_selected.gender ;
      this.education = this.reposijudicial_selected.education ;
      this.designation = this.reposijudicial_selected.designation ;
      this.address = this.reposijudicial_selected.address ;
      this.IMAGEN_PREVIZUALIZA = this.reposijudicial_selected.avatar;
    })

    this.reposijudicial_selected.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.roles = resp.roles;
    })
  }

  save(){
    this.text_validation = '';
    if(!this.name || !this.email || !this.surname){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (name,surname,email)";
      return;
    }
    if(this.password){
      if(this.password != this.password_confirmation){
        this.text_validation = "LAS CONTRASEÑA DEBEN SER IGUALES";
        return;
      }
    }
    console.log(this.selectedValue);

    let formData = new FormData();
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("mobile",this.mobile);
    formData.append("birth_date",this.birth_date);
    formData.append("gender",this.gender+"");
    if(this.education){
      formData.append("education",this.education);
    }
    if(this.designation){
      formData.append("designation",this.designation);
    }
    if(this.address){
      formData.append("address",this.address);
    }
    if(this.password){
      formData.append("password",this.password);
    }
    formData.append("role_id",this.selectedValue);
    if(this.FILE_AVATAR){
      formData.append("imagen",this.FILE_AVATAR);
    }
    
    this.reposijudicial_selected.updateUser(this.reposijudicial_id,formData).subscribe((resp:any) => {
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
    reader.onloadend = () => this.IMAGEN_PREVIZUALIZA = reader.result;
  }

}
