import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../../config/config';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticantesService {
  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listArea() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_mes = URL_BACKEND + "/area";
    return this.http.get(url_mes, { headers: headers });
  }

  listPracticanteById(practicante_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_practicante = URL_BACKEND + "/practicantes/" + practicante_id;
    return this.http.get(url_practicante, {headers: headers});
  }

  getPracticantes(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_practicante = URL_BACKEND + "/practicantes";
    return this.http.get(url_practicante, {headers: headers});
  }

  registrarPracticante(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const url_practicante = URL_BACKEND + "/practicantes";
    return this.http.post(url_practicante,data,{headers: headers});
  }

  updatePracticante(practicante_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_practicante = URL_BACKEND + "/practicantes/" + practicante_id;
    return this.http.put(url_practicante, data, {headers: headers});
  }

  deletePracticante(practicante_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_practicante = URL_BACKEND + "/practicantes/" + practicante_id;
    return this.http.delete(url_practicante, {headers: headers});
  }




  listUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes";
    return this.http.get(URL,{headers: headers});
  }

  listConfig(){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes/config";
    return this.http.get(URL,{headers: headers});
  }

  registerUser(data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes";
    return this.http.post(URL,data,{headers: headers});
  }

  showUser(practicantes_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes/"+practicantes_id;
    return this.http.get(URL,{headers: headers});
  }

  updateUser(practicantes_id:string,data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes/"+practicantes_id;
    return this.http.post(URL,data,{headers: headers});
  }

  deleteUser(practicantes_id:string){
    const headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    const URL = URL_SERVICIOS+"/practicantes/"+practicantes_id;
    return this.http.delete(URL,{headers: headers});
  }
}