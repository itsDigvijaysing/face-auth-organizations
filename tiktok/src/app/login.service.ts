import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  verifyEmailReq(data: any){
    let url = `http://localhost:5000/login-req`;
    return this.http.post(url, data);
  }

  verifyUser(data: any){
    let url = `http://localhost:5000/login`;
    return this.http.post(url, data);
  }

}
