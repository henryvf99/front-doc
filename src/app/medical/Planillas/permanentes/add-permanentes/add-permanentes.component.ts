import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermanentesService } from '../service/permanentes.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-add-permanentes',
  templateUrl: './add-permanentes.component.html',
  styleUrl: './add-permanentes.component.scss'
})
export class AddPermanentesComponent implements OnInit{
  
  public selectedFileName: string = ''; 
  public buffer: ArrayBuffer | null = null;

  public years: any[] = [];
  public selectedYear: any = "";

  public months: any[] = [];
  public selectedMonth: any = "";

  public tipotrabajadores: any[] = [];
  public selectedtipotrabajador: any = "";

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

  public observacion: string = "";
  private idtipotrabajador = "6614de2972fa497e6831fdd6";
  public selectedregimen: any = "";

  public roles:any = [];

  public text_success:string = '';
  public text_validation:string = '';

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public permanentesService: PermanentesService,
    private router: Router,
    public authService: AuthService,
    public userService: StaffService
  ) {
    
  }

  ngOnInit(): void {

    this.user_id = this.permanentesService.authService.user.id;
    this.listUser(this.user_id);
    
    this.permanentesService.listYears().subscribe((resp:any) => {
      this.years = resp.data;
    })

    this.permanentesService.listMonths().subscribe((resp:any) => {
      this.months = resp.data;
    })

    this.permanentesService.listTipoTrabajador().subscribe((resp:any) => {
      this.tipotrabajadores = resp.data;
    })

    this.selectedtipotrabajador = this.idtipotrabajador;

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
    if ($event.target.files.length === 0 || 
      $event.target.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.text_validation = "SOLAMENTE PUEDEN SER ARCHIVOS DE TIPO EXCEL (.xlsx)";
      return;
    }
    this.text_validation = '';
    
    const file = $event.target.files[0];
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        this.buffer = arrayBuffer;
    };
    reader.readAsArrayBuffer(file);
  }

  save(){
    this.text_validation = '';
    if( !this.selectedYear || !this.selectedMonth || !this.selectedtipotrabajador || !this.selectedregimen || !this.buffer ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (Año, Mes, Tipo de trabajador, Régimen y Planilla)";
      return;
    }

    let formData = new FormData();
    formData.append("anio",this.selectedYear);
    formData.append("mes",this.selectedMonth);
    formData.append("tipotrabajador",this.selectedtipotrabajador);
    formData.append("regimen",this.selectedregimen);
    formData.append("observacion",this.observacion || '-');
    formData.append("nombrearchivo",this.selectedFileName);
    if (this.buffer !== null) {
      formData.append("file", new Blob([this.buffer]));
    }

    this.permanentesService.registrarPlanilla(formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'La planilla no se registro correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La planilla no se registro correctamente',
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
      title: 'La planilla se agregó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/permanentes/list-permanentes');
    });
  }

}
