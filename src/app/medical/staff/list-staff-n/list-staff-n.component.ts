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
  public searchDataValue = '';
  public searchRoleValue = '';
  public searchDateValue = '';

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

  isPermision(permission: string) {
    if (this.user.rol.nombre.includes("ADMIN")) {
      return true;
    }
    if (this.user.permissions.includes(permission)) {
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

        res.aceptacion = res.aceptacion ? res.aceptacion : null;
        res.certificado = res.certificado ? res.certificado : null;

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

  deleteUser(trabajador_id: string) {
    this.staffService.deleteUser(trabajador_id).subscribe((res: any) => {
      console.log(res);
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
  
  public searchData(value: any): void {
    const searchTerm = value.trim().toLowerCase();
    this.usersList = this.role_generals.filter((user: any) =>
    (`${user.name} ${user.surname}`.toLowerCase().includes(searchTerm) ||
        user.role.name.toLowerCase().includes(searchTerm)) &&
      (!this.searchRoleValue || user.role.name.toLowerCase().includes(this.searchRoleValue.trim().toLowerCase()))
    );
  }
  
  public searchByRole(value: any): void {
    this.searchRoleValue = value.trim().toLowerCase();
    const searchTerm = this.searchDataValue.trim().toLowerCase();
    this.usersList = this.role_generals.filter((user: any) =>
      (`${user.name} ${user.surname}`.toLowerCase().includes(searchTerm) ||
        user.role.name.toLowerCase().includes(searchTerm)) &&
      (!this.searchRoleValue || user.role.name.toLowerCase().includes(this.searchRoleValue))
      );
    }
    public searchByDate(value: any): void {
      this.dataSource.filter = value.trim().toLowerCase();
      this.usersList = this.dataSource.filteredData;
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
    this.searchDataValue = '';
    this.searchRoleValue = '';
    this.searchDateValue = '';

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
