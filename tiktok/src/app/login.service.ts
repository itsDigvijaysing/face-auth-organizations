import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  verifyEmailReq(data: any){
    return this.http.post(`${environment.apiBaseUrl}/login-req`, data);
  }

  verifyUser(data: any){
    return this.http.post(`${environment.apiBaseUrl}/login`, data);
  }

}
