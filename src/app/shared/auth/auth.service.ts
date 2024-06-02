import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { URL_SUMARIZACION } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user:any;
  token:any;
  constructor(
    private router: Router,
    public http: HttpClient,
  ) {
    this.getLocalStorage();
  }

  traducirPdfTexto(data: any){
    const url_traduccion = URL_SUMARIZACION + "/convertir";
    return this.http.post(url_traduccion,data);
  }

  getLocalStorage(){
    if(localStorage.getItem("token") && localStorage.getItem("user")){
      let USER = localStorage.getItem("user");
      this.user = JSON.parse(USER ? USER : '');
      this.token = localStorage.getItem("token");
    }else{
      this.user = null;
      this.token = null;
    }
  }

  login(email:string,password:string) {

    let URL = "http://localhost:3000/api/auth/login";
    return this.http.post(URL,{email: email,password: password}).pipe(
      map((auth:any) => {
        console.log(auth.user.rol.nombre);
        const result = this.saveLocalStorage(auth);
        return result;
      }),
      catchError((error:any) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  saveLocalStorage(auth:any){
    if(auth && auth.token){
      localStorage.setItem("token",auth.token);
      localStorage.setItem("user",JSON.stringify(auth.user));
      localStorage.setItem('authenticated', 'true');
      return true;
    }
    return false;
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem('authenticated');
    this.router.navigate([routes.login]);
  }
}
