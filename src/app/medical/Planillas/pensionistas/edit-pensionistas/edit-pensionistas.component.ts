import { Component } from '@angular/core';
import { PensionistasService } from '../service/pensionistas.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-edit-pensionistas',
  templateUrl: './edit-pensionistas.component.html',
  styleUrl: './edit-pensionistas.component.scss'
})
export class EditPensionistasComponent {

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";

  public observacion: string = ''; 

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
  public planilla_id:any;
  public planilla_data:any;
  public roles:any = [];

  public text_success:string = '';
  public text_validation:string = '';

  public pensionistas_id:any;
  public pensionistas_selected:any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public pensionistasService: PensionistasService,
    public activedRoute: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public userService: StaffService
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.pensionistasService.authService.user.id;
    this.listUser(this.user_id);
    
    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.planilla_id = resp.id;
    })

    this.pensionistasService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.pensionistasService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.pensionistasService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.pensionistasService.listPlanillaById(this.planilla_id).subscribe((resp:any) => {
      console.log(resp);
      this.planilla_data = resp.data;
      this.selectedYear = this.planilla_data.anio.id;
      this.selectedMonth = this.planilla_data.mes.id;
      this.selectedtipotrabajador = this.planilla_data.tipotrabajador.id;
      this.selectedregimen = this.planilla_data.regimen;
      this.observacion = this.planilla_data.observacion;
      this.selectedFileName = this.planilla_data.nombrearchivo;
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
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipotrabajador || !this.selectedregimen ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de trabajador y Régimen)";
      return;
    }

    let formData = new FormData();
    formData.append("anio",this.selectedYear);
    formData.append("mes",this.selectedMonth);
    formData.append("tipotrabajador",this.selectedtipotrabajador);
    formData.append("observacion",this.observacion);
    formData.append("regimen",this.selectedregimen);
    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }
    
    this.pensionistasService.updatePlanilla(this.planilla_id, formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.success){
        this.text_validation = resp.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'La planilla no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La planilla no se actualizó correctamente',
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
      title: 'La planilla se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/pensionistas/list-pensionistas');
    });
  }

}
