import { Component } from '@angular/core';
import { RequerimientosService } from '../service/requerimientos.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-requerimientos',
  templateUrl: './list-requerimientos.component.html',
  styleUrl: './list-requerimientos.component.scss'
})
export class ListRequerimientosComponent {

  private idtipodocumento = "6614e10d72fa497e6831fdfe";

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
  public requerimientos_selected:any;
  public user:any;
  constructor(
    public requerimientosService: RequerimientosService,
  ){

  }
  ngOnInit() {
    this.getTableData();
    this.user = this.requerimientosService.authService.user;
  }
  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.requerimientosService.getEmitidosTipoDocumento(this.idtipodocumento).subscribe((resp:any) => {
      this.totalData = resp.data.length;
      this.role_generals = resp.data;
      this.getTableDataGeneral();
    })

  }
  isPermision(permission:string){
    if(this.user.rol.nombre.includes("ADMIN")){
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
    this.requerimientos_selected = rol;
  }

  deleteDocumento(documento_id: string) {
    this.requerimientosService.deleteEmitidos(documento_id).subscribe((res: any) => {
      console.log(res);
      if(res.success){
        this.mostrarMensajeDeExito();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El documento no se elimino correctamente',
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
      title: 'El documento se eliminó correctamente',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      window.location.reload();
    });
  }

  public refresh(): void {
    window.location.reload();
  }

  public mostrarFile(file: any[]){

    if(file.length === 0){
      console.log("vacio");
      Swal.fire({
        title: '¡Advertencia!',
        text: 'No se ha agregado un documento de referencia.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
      return
    }

    const blob = new Blob([new Uint8Array(file)], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
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

}
