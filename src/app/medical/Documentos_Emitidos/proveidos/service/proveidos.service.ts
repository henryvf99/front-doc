import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveidosService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listYears() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_anio = URL_BACKEND + "/anio";
    return this.http.get(url_anio, { headers: headers });
  }

  listMonths() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/mes";
    return this.http.get(url_mes, { headers: headers });
  }

  listTipoDocumento() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/tipodocumento";
    return this.http.get(url_mes, { headers: headers });
  }

  listEmitidosById(boleta_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/emitidos/" + boleta_id;
    return this.http.get(url_boleta, {headers: headers});
  }

  getEmitidosTipoDocumento(idtipotrabajador: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/emitidos/tipodocumento/" + idtipotrabajador;
    return this.http.get(url_boleta, {headers: headers});
  }

  registrarEmitidos(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const url_boleta = URL_BACKEND + "/emitidos";
    return this.http.post(url_boleta,data,{headers: headers});
  }

  updateEmitidos(boleta_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/emitidos/" + boleta_id;
    return this.http.put(url_boleta, data, {headers: headers});
  }

  deleteEmitidos(casdirectivosb_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/emitidos/" + casdirectivosb_id;
    return this.http.delete(url_boleta, {headers: headers});
  }

  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos";
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos/config";
    return this.http.get(URL,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos";
    return this.http.post(URL,data,{headers: headers});
  }

  showUser(proveidos_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos/"+proveidos_id;
    return this.http.get(URL,{headers: headers});
  }

  updateUser(proveidos_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos/"+proveidos_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(proveidos_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/proveidos/"+proveidos_id;
    return this.http.delete(URL,{headers: headers});
  }
}