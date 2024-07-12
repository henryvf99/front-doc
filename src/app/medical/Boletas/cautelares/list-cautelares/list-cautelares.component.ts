import { Component } from '@angular/core';
import { CautelaresService } from '../service/cautelares.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-list-cautelares',
  templateUrl: './list-cautelares.component.html',
  styleUrl: './list-cautelares.component.scss'
})
export class ListCautelaresComponent {
  public usersList:any = [];
  dataSource!: MatTableDataSource<any>;

  private idtipotrabajador = "66234c2776fc363243ddb9d8";

  public searchAnioValue = '';
  public searchMesValue = '';
  public searchNombreValue = '';
  public searchApellidosValue = '';

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;//MIN
  public limit: number = this.pageSize;//MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public role_generals:any = [];
  public cautelares_selected:any;
  public user:any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public cautelaresService: CautelaresService,
    public authService: AuthService,
    public userService: StaffService
  ){

  }

  ngOnInit() {
    this.user = this.cautelaresService.authService.user;
    this.user_id = this.cautelaresService.authService.user.id;
    this.listUser(this.user_id);
    this.getTableData();
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

  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.cautelaresService.getBoletaTipoTrabajador(this.idtipotrabajador).subscribe((resp:any) => {
      this.totalData = resp.data.length;
      this.role_generals = resp.data;
      this.getTableDataGeneral();
    })


  }
  isPermision(permission:string){
    if(this.user.rol.nombre.includes("ADMIN")){
      return true;
    }
    if(this.user.rol.nombre.includes("USER")){
      return true;
    }
    if(this.user.permissions.includes(permission)){
      return true;
    }
    return false;
  }
  getTableDataGeneral() {
    this.usersList = [];
    this.serialNumberArray = [];

    this.role_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        
        this.usersList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.usersList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectUser(rol:any){
    this.cautelares_selected = rol;
  }

  confirmarEliminacion(object_id: string) {
    Swal.fire({
      title: '¿Está segur@ que desea eliminar?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBoleta(object_id);
      }
    });
  }
  
  deleteBoleta(casdirectivosb_id: string) {
    this.cautelaresService.deleteBoleta(casdirectivosb_id).subscribe((res: any) => {
  
      if(res.success){
        this.mostrarMensajeDeExito();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La boleta no se elimino correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  }

  mostrarMensajeDeExito() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La boleta se eliminó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      window.location.reload();
    });
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
  }

  public buscarPorAnio(anio: string): void {
    anio = anio.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.anio.nombre.toLowerCase().includes(anio)
    );
  }
  
  public buscarPorMes(mes: string): void {
      mes = mes.trim().toLowerCase();
      this.usersList = this.role_generals.filter((data:any) =>
          data.mes.nombre.toLowerCase().includes(mes)
      );
  }

  public buscarPorNombre(value: any): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.trabajador.nombres.toLowerCase().includes(value)
    );
  }

  public buscarPorApellido(value: any): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.trabajador.apellidos.toLowerCase().includes(value)
    );
  }

  public sortData(sort: any) {
    const data = this.usersList.slice();

    if (!sort.active || sort.direction === '') {
      this.usersList = data;
    } else {
      this.usersList = data.sort((a:any, b:any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableDataGeneral();
  }

  public refresh(): void {
    window.location.reload();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
      // 1
      // 0 - 10
      // 2
      // 10 - 20
    }
  }

  public mostrarFile(file: any[]){
    const blob = new Blob([new Uint8Array(file)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
  }

}
