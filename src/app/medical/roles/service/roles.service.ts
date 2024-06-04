import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../config/config';
import { AuthService } from '../../../shared/auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listPermisosById(permiso_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_permiso = URL_BACKEND + "/permisos/" + permiso_id;
    return this.http.get(url_permiso, {headers: headers});
  }

  getPermisos(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_permiso = URL_BACKEND + "/permisos";
    return this.http.get(url_permiso, {headers: headers});
  }

  registrarPermisos(data:any){
    const url_permiso = URL_BACKEND + "/permisos";
    return this.http.post(url_permiso,data);
  }

  updatePermisos(permiso_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_permiso = URL_BACKEND + "/permisos/" + permiso_id;
    return this.http.put(url_permiso, data, {headers: headers});
  }

  deletePermisos(permiso_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_permiso = URL_BACKEND + "/permisos/" + permiso_id;
    return this.http.delete(url_permiso, {headers: headers});
  }

}
