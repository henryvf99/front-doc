import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReposijudicialbService {

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

  listBoletaById(boleta_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta/" + boleta_id;
    return this.http.get(url_boleta, {headers: headers});
  }

  getBoletaTipoTrabajador(idtipotrabajador: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta/tipotrabajador/" + idtipotrabajador;
    return this.http.get(url_boleta, {headers: headers});
  }

  registrarBoleta(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta";
    return this.http.post(url_boleta,data,{headers: headers});
  }

  updateBoleta(boleta_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta/" + boleta_id;
    return this.http.put(url_boleta, data, {headers: headers});
  }

  deleteBoleta(casdirectivosb_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta/" + casdirectivosb_id;
    return this.http.delete(url_boleta, {headers: headers});
  }

  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb";
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb/config";
    return this.http.get(URL,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb";
    return this.http.post(URL,data,{headers: headers});
  }

  showUser(reposijudicialb_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb/"+reposijudicialb_id;
    return this.http.get(URL,{headers: headers});
  }

  updateUser(reposijudicialb_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb/"+reposijudicialb_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(reposijudicialb_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/reposijudicialb/"+reposijudicialb_id;
    return this.http.delete(URL,{headers: headers});
  }
}
