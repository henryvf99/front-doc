import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS, URL_BACKEND } from '../../../config/config';
import { AuthService } from '../../../shared/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  listRol() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/rol";
    return this.http.get(url_user, { headers: headers });
  }

  listArea() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/area";
    return this.http.get(url_user, { headers: headers });
  }

  listPermisos() {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/permisos";
    return this.http.get(url_user, { headers: headers });
  }

  listUserById(user_id: string){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/user/" + user_id;
    return this.http.get(url_user, {headers: headers});
  }

  getUsers(){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/user";
    return this.http.get(url_user, {headers: headers});
  }

  registrarUser(data:any){
    const url_user = URL_BACKEND + "/auth/signup";
    return this.http.post(url_user,data);
  }

  updateUser(user_id: string, data:any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/user/" + user_id;
    return this.http.put(url_user, data, {headers: headers});
  }

  deleteUser(user_id: string):Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const url_user = URL_BACKEND + "/user/" + user_id;
    return this.http.delete(url_user, {headers: headers});
  }

}
