import { Component } from '@angular/core';
import { CesanteService } from '../service/cesante.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/auth/auth.service';
import { StaffService } from '../../../staff/service/staff.service';

@Component({
  selector: 'app-list-cesante',
  templateUrl: './list-cesante.component.html',
  styleUrl: './list-cesante.component.scss'
})
export class ListCesanteComponent {

  private idtipotrabajador = "66234c4676fc363243ddb9dc";

  public searchDniValue = '';
  public searchNombreValue = '';
  public searchApellidosValue = '';

  public usersList:any = [];
  dataSource!: MatTableDataSource<any>;

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
  public cesante_selected:any;
  public user:any;

  public permisos: any;
  public user_id: string = "";
  public permiso_id: string = "";

  constructor(
    public cesanteService: CesanteService,
    public service: AuthService,
    public userService: StaffService
  ){

  }

  ngOnInit() {
    this.getTableData();
    this.user = this.cesanteService.authService.user;
    this.user_id = this.cesanteService.authService.user.id;
    this.listUser(this.user_id);
  }

  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.cesanteService.getTrabajadorTipoTrabajador(this.idtipotrabajador).subscribe((resp:any) => {
      this.totalData = resp.data.length;
      this.role_generals = resp.data;
      this.getTableDataGeneral();
    })
  }

  listUser(user_id: string){
    this.userService.listUserById(user_id).subscribe((resp:any) => {
      this.permiso_id = resp.data.permisos.id;
      this.listPermisos(this.permiso_id);
    })
  }

  listPermisos(id: string){
    this.service.getProfile(id).subscribe((resp:any) => {
      this.permisos = resp.data;
    })
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
    this.cesante_selected = rol;
  }

  deleteTrabajador(trabajador_id: string) {
    this.cesanteService.deleteTrabajador(trabajador_id).subscribe((res: any) => {
      
      if(res.success){
        this.mostrarMensajeDeExito();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El trabajador no se elimino correctamente',
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
      title: 'El trabajador se eliminó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      window.location.reload();
    });
  }

  public refresh(): void {
    window.location.reload();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
  }

  public buscarPorDni(value: string): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.dni.toLowerCase().includes(value)
    );
  }
  
  public buscarPorNombre(value: any): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.nombres.toLowerCase().includes(value)
    );
  }
  
  public buscarPorApellido(value: any): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.apellidos.toLowerCase().includes(value)
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

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });

    }
  }

}
