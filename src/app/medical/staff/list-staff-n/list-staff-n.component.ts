import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';
import { MatTableDataSource } from '@angular/material/table';
import 'sweetalert2/src/sweetalert2.scss'
import Swal from 'sweetalert2'
import $ from 'jquery';


@Component({
  selector: 'app-list-staff-n',
  templateUrl: './list-staff-n.component.html',
  styleUrls: ['./list-staff-n.component.scss']
})
export class ListStaffNComponent {

  public usersList: any = [];
  dataSource!: MatTableDataSource<any>;

  public showFilter = false;

  public searchNombresValue = '';
  public searchApellidosValue = '';
  public searchAreaValue = '';

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

  public role_generals: any = [];
  public staff_selected: any;
  public user: any;
  constructor(
    public staffService: StaffService,
  ) {

  }
  
  ngOnInit() {
    this.getTableData();
    this.user = this.staffService.authService.user;
  }

  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.staffService.getUsers().subscribe((resp:any) => {
      this.totalData = resp.data.length;
      this.role_generals = resp.data;
      this.getTableDataGeneral();
    })
  }

  isPermision(){
    if(this.user.rol.nombre.includes("ADMIN")){
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

  selectUser(rol: any) {
    this.staff_selected = rol;
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
        this.deleteUser(object_id);
      }
    });
  }

  deleteUser(trabajador_id: string) {
    this.staffService.deleteUser(trabajador_id).subscribe((res: any) => {
      if(res.success){
        this.mostrarMensajeDeExito();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario no se elimino correctamente',
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
      title: 'El usuario se eliminó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      window.location.reload();
    });
  }

  public refresh(): void {
    window.location.reload();
  }
  
  public buscarPorArea(value: string): void {
    value = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((data:any) =>
        data.area.nombre.toLowerCase().includes(value)
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
      this.usersList = data.sort((a: any, b: any) => {
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
    this.searchNombresValue = '';
    this.searchApellidosValue = '';
    this.searchAreaValue = '';

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
