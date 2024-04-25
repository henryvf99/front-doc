import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegidoresService {

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

  listTipoTrabajador() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/tipotrabajador";
    return this.http.get(url_mes, { headers: headers });
  }

  listTrabajador() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/trabajador";
    return this.http.get(url_mes, { headers: headers });
  }

  listPlanillaById(boleta_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/planilla/" + boleta_id;
    return this.http.get(url_boleta, {headers: headers});
  }

  getPlanillaTipoTrabajador(idtipotrabajador: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/planilla/tipotrabajador/" + idtipotrabajador;
    return this.http.get(url_boleta, {headers: headers});
  }

  registrarPlanilla(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const url_boleta = URL_BACKEND + "/planilla";
    return this.http.post(url_boleta,data,{headers: headers});
  }

  updatePlanilla(boleta_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/planilla/" + boleta_id;
    return this.http.put(url_boleta, data, {headers: headers});
  }

  deletePlanilla(casdirectivosb_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/planilla/" + casdirectivosb_id;
    return this.http.delete(url_boleta, {headers: headers});
  }

  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores";
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores/config";
    return this.http.get(URL,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores";
    return this.http.post(URL,data,{headers: headers});
  }

  showUser(regidores_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores/"+regidores_id;
    return this.http.get(URL,{headers: headers});
  }

  updateUser(regidores_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores/"+regidores_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(regidores_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/regidores/"+regidores_id;
    return this.http.delete(URL,{headers: headers});
  }
}