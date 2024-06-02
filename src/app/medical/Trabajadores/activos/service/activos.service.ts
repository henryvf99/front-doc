import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listTipoTrabajador() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/tipotrabajador";
    return this.http.get(url_mes, { headers: headers });
  }

  listCargo() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/cargo";
    return this.http.get(url_mes, { headers: headers });
  }

  listArea() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/area";
    return this.http.get(url_mes, { headers: headers });
  }

  listTrabajadorById(trabajador_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador/" + trabajador_id;
    return this.http.get(url_trabajador, {headers: headers});
  }

  getTrabajadorTipoTrabajador(idtipotrabajador: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador/tipotrabajador/" + idtipotrabajador;
    return this.http.get(url_trabajador, {headers: headers});
  }

  registrarTrabajador(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador";
    return this.http.post(url_trabajador,data,{headers: headers});
  }

  updateTrabajador(trabajador_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador/" + trabajador_id;
    return this.http.put(url_trabajador, data, {headers: headers});
  }

  deleteTrabajador(trabajador_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador/" + trabajador_id;
    return this.http.delete(url_trabajador, {headers: headers});
  }



  

  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos";
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos/config";
    return this.http.get(URL,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos";
    return this.http.post(URL,data,{headers: headers});
  }

  showUser(activos_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos/"+activos_id;
    return this.http.get(URL,{headers: headers});
  }

  updateUser(activos_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos/"+activos_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(activos_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/activos/"+activos_id;
    return this.http.delete(URL,{headers: headers});
  }
}