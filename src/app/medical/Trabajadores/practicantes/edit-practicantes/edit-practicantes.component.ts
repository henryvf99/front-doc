import { Component } from '@angular/core';
import { PracticantesService } from '../service/practicantes.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-practicantes',
  templateUrl: './edit-practicantes.component.html',
  styleUrl: './edit-practicantes.component.scss'
})
export class EditPracticantesComponent {

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

  public practicante_id: any;
  public practicante_selected: any;

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public practicantesService: PracticantesService,
    public activedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.practicante_id = resp.id;
    })

    this.practicantesService.listArea().subscribe((resp:any) => {
      this.areas = resp.data;
    })
    
    this.practicantesService.listPracticanteById(this.practicante_id).subscribe((resp:any) => {
      console.log(resp);
      this.practicante_selected = resp.data;
      this.nombre = this.practicante_selected.nombre;
      this.apellidos = this.practicante_selected.apellidos;
      this.universidad = this.practicante_selected.universidad;
      this.horapracticas = this.practicante_selected.horapracticas;
      this.selectearea = this.practicante_selected.area.id;
      this.carrera = this.practicante_selected.carrera;
      this.fingreso = this.practicante_selected.fingreso;
      this.fsalida = this.practicante_selected.fsalida;
      this.selectedFileName = this.practicante_selected.nombrearchivo || " ";
      this.selectedFileName2 = this.practicante_selected.nombrearchivo2 || " ";
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
    if( !this.selectearea  ){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (anio,mes,regimen,avatar)";
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

    this.practicantesService.updatePracticante(this.practicante_id, formData).subscribe((res:any) => {

      if(res.success){
        this.text_validation = res.message_text;
        this.mostrarMensajeDeExito();
      }else{
        this.text_success = 'El practicante no se actualizó correctamente';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El practicante no se actualizó correctamente',
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
      title: 'El practicante se actualizó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigateByUrl('/practicantes/list-practicantes');
    });
  }

}
