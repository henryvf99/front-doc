import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../config/config';
import { AuthService } from '../../../shared/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  getTrabajadores(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/trabajador";
    return this.http.get(url_trabajador, {headers: headers});
  }

  getPracticantes(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_trabajador = URL_BACKEND + "/practicantes";
    return this.http.get(url_trabajador, {headers: headers});
  }

  getBoletas(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta";
    return this.http.get(url_boleta, {headers: headers});
  }

  getPlanillas(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_planilla = URL_BACKEND + "/planilla";
    return this.http.get(url_planilla, {headers: headers});
  }

  getEmitidos(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_emitidos = URL_BACKEND + "/emitidos";
    return this.http.get(url_emitidos, {headers: headers});
  }

  getRecibidos(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_recibidos = URL_BACKEND + "/recibidos";
    return this.http.get(url_recibidos, {headers: headers});
  }

    
  getConfigdashboard(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/dashboard/config";
    return this.http.get(URL,{headers: headers});
  }

  dashboardAdmin(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/dashboard/admin";
    return this.http.post(URL,data,{headers: headers});
  }

  dashboardAdminYear(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/dashboard/admin-year";
    return this.http.post(URL,data,{headers: headers});
  }



}
