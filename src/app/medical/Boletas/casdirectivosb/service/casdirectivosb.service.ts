import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CasdirectivosbService {
  url= "http://localhost:3000/api/boleta";

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

  listBoletaById(boleta_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_boleta = URL_BACKEND + "/boleta/" + boleta_id;
    return this.http.get(url_boleta, {headers: headers});
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
    return this.http.get(this.url,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    return this.http.get(this.url,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    return this.http.post(this.url,data,{headers: headers});
  }

  showUser(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    return this.http.get(this.url,{headers: headers});
  }

  updateUser(casdirectivosb_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/casdirectivosb/"+casdirectivosb_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(casdirectivosb_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const URL = this.url + "/" + casdirectivosb_id;
    return this.http.delete(URL, {headers: headers});
  }
  
}
