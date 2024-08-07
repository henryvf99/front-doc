import { Component } from '@angular/core';
import { CesantesbService } from '../service/cesantesb.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-edit-cesantesb',
  templateUrl: './edit-cesantesb.component.html',
  styleUrl: './edit-cesantesb.component.scss'
})
export class EditCesantesbComponent {

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";

  public trabajadores: any[] = [];
  public selectedtrabajador: any = "";

  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public regimenes: any[] = [
    {
      nombre: "276"
    },
    {
      nombre: "728"
    },
    {
      nombre: "1057"
    }
  ]
  
  public selectedregimen: any = "";
  public boleta_id:any;
  public casdirectivosb_selected:any;
  public selectedValue !: string ;

  public text_success:string = '';
  public text_validation:string = '';

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public cesantesbService: CesantesbService,
    public activedRoute: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public userService: StaffService
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.cesantesbService.authService.user.id;
    this.listUser(this.user_id);
    
    this.activedRoute.params.subscribe((resp:any) => {
      
      this.boleta_id = resp.id;
    })

    this.cesantesbService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.cesantesbService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.cesantesbService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.cesantesbService.listTrabajador().subscribe((resp:any) => {
      this.trabajadores = resp.data;
    })

    this.cesantesbService.listBoletaById(this.boleta_id).subscribe((resp:any) => {
      
      this.casdirectivosb_selected = resp.data;
      this.selectedYear = this.casdirectivosb_selected.anio.id;
      this.selectedMonth = this.casdirectivosb_selected.mes.id;
      this.selectedtipotrabajador = this.casdirectivosb_selected.tipotrabajador.id;
      this.selectedtrabajador = this.casdirectivosb_selected.trabajador.id;
      this.selectedregimen = this.casdirectivosb_selected.regimen ;
      this.selectedFileName = this.casdirectivosb_selected.nombrearchivo;
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

  save(){
    this.text_validation = '';
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipotrabajador || !this.selectedtrabajador || !this.selectedregimen ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de trabajador, Trabajador y Régimen)";
      return;
    }

    let formData = new FormData();
    formData.append("anio",this.selectedYear);
    formData.append("mes",this.selectedMonth);
    formData.append("tipotrabajador",this.selectedtipotrabajador);
    formData.append("trabajador",this.selectedtrabajador);
    formData.append("regimen",this.selectedregimen);
    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }
    
    this.cesantesbService.updateBoleta(this.boleta_id,formData).subscribe((resp:any) => {
      

      if(resp.success){
        this.text_validation = resp.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'La boleta no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La boleta no se actualizó correctamente',
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
      title: 'La boleta se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/cesantesb/list-cesantesb');
    });
  }

}
